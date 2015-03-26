(ns lambdacon.simple-chat
  (:require [lambdacon.state :as state]
            [compojure.core :as compojure :refer [GET POST]]
            [hiccup
             [core :refer [html]]
             [util :as u]
             [page :as p :refer [html5]]]
            [ring.middleware
             [cookies :refer [wrap-cookies]]
             [params :refer [wrap-params]]
             [resource :refer [wrap-resource]]]
            [clojure.data.json :as json]
            [org.httpkit.server :as server]
            [clojure.java.io :as io])
  (:import [java.util Date]))

;; ## Handlers

(defn render-chat
  "Render the Chat HTML."
  []
  (html5
    [:head
     [:title "Bologna Chat"]
     (p/include-js "/jquery.js" "/chat.js")
     (p/include-css "/chat.css")]
    [:body
     [:div#content
      [:h1 "Welcome to the Chat!"]
      [:div#chat]
      [:form#submit
        [:input#message {:type :text :placeholder "Write something ..."}]
        [:button#submit-message "Send"]]
      [:div#error]]]))

;; ## Middleware

(defn wrap-stores
  "Add the keys ':message-store' and ':user-store' to incoming
   requests."
  [handler user-store global-message-store]
  (fn [request]
    (-> request
        (assoc :user-store user-store)
        (assoc :message-store global-message-store)
        (handler))))

;; ## Routes

(defn make-handler
  "Create handler for chat app."
  [user-store global-message-store]
  (-> (compojure/routes
        (GET "/" req (render-chat)))
      (wrap-stores user-store global-message-store)
      (wrap-params)
      (wrap-cookies)
      (wrap-resource "public")))

;; ## Server + Restart
;;
;; Start the server using:
;;
;;     (require '[lambdacon.simple-chat :as chat])
;;     (chat/reset)

(defonce server
  nil)

(def handler
  "The global handler."
  (make-handler
    (state/user-store state/atom-message-store)
    (state/file-message-store
      (io/file "./messages.txt"))))

(defn reset
  "(Re)Start the Chat app."
  []
  (->> (fn [server]
         (when server
           (server))
         (server/run-server #'handler {:port 7700}))
       (alter-var-root #'server)))
