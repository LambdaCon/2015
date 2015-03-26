(ns lambdacon.state
  (:require [potemkin :refer [defprotocol+]]
            [clojure.java.io :as io])
  (:import [java.io File Writer Reader]))

;; ## Types
;;
;; These datastructures are maintained as internal state.

(defrecord Message [username timestamp message-string])
(defrecord User [username message-store])

;; ## Protocols
;;
;; We're using `potemkin/defprotocol+` because it prevents redefinitions of the
;; protocol var if nothing changed.

(defprotocol+ MessageStore
  "Protocol for Message Storage."
  (store-message! [this ^Message message]
    "Store a message.")
  (clear-messages! [this]
    "Delete all messages from store.")
  (messages [this]
    "Return a seq of all stored messages.")
  (register-observer! [this f]
    "Register a function that gets called with each new message
     that is put into the store."))

(defprotocol+ UserStore
  "Protocol for User Storage."
  (users [this]
    "Return a map of all users by username.")
  (add-user! [this username]
    "Add a new user with a fresh message store. Should return the user if
     operation succeeded, and false if it failed (because of username
     already being taken).")
  (user-by-username [this username]
    "Get a user by username.")
  (remove-user! [this username]
    "Remove a user and clear his message store."))

;; ## Atom-Based Message Store

(defn atom-message-store
  "Create an instance of `MessageStore` using an Atom."
  []
  (let [data (atom [])]
    (reify MessageStore
      (store-message! [_ msg]
        )
      (messages [_]
        )
      (clear-messages! [_]
        )
      (register-observer! [_ f]
        ))))

;; ##  User Store

(defn user-store
  "Create an in-memory instance of `UserStore` using a Ref."
  [message-store-fn]
  (let [data (ref {})]
    (reify UserStore
      (users [this]
        )
      (add-user! [this username]
        )
      (user-by-username [this username]
        )
      (remove-user! [this username]
        ))))

;; ## File-Based Implementation

(defn create-append-writer
  ^java.io.Writer
  [^File file]
  (io/writer file :append true))

(defn append-message!
  [^File file ^Message {:keys [username timestamp message-string] :as msg}]
  (with-open [w (create-append-writer file)]
    (doto w
      (.write (pr-str msg))
      (.write "\n")
      (.flush))))

(defn read-messages!
  [^File file]
  (when (.isFile file)
    (with-open [r (io/reader file)]
      (loop [sq []]
        (if-let [s (.readLine r)]
          (recur (conj sq (read-string s)))
          sq)))))

(defn call-observers!
  [observers ^Message message]
  (doseq [o observers]
    (try
      (o message)
      (catch Exception ex
        ;; observers should handle their own exceptions
        ))))

(defn create-temporary-file!
  ^java.io.File
  []
  (doto (File/createTempFile "messages" ".txt")
    (.deleteOnExit)))

(defn file-message-store
  "Create an instance of `MessageStore` that persists data on disk."
  ([] (file-message-store (create-temporary-file!)))
  ([^File file]
   (let [observers (atom [])]
     (reify MessageStore
       (store-message! [_ msg]
       )
       (messages [_]
         )
       (clear-messages! [_]
         )
       (register-observer! [_ f]
         )))))
