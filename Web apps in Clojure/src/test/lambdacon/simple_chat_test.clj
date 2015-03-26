(ns lambdacon.simple-chat-test
  (:require [clojure.test :refer :all]
            [clojure.data.json :as json]
            [clojure.string :as string]
            [ring.util.codec :as codec]
            [lambdacon.test-reporting :refer [inject-reporting!]]
            [lambdacon
             [state :as state]
             [simple-chat :refer :all]]))

(inject-reporting!)

;; ## Fixtures

(defn dummy-user-store
  []
  (state/user-store state/atom-message-store))

(defn test-handler
  []
  (make-handler
    (dummy-user-store)
    (state/atom-message-store)))

(def content-type-header
  {"content-type" "application/x-www-form-urlencoded"})

(defn username-header
  [username]
  {"cookie" (format "username=%s" (codec/url-encode username))})

(defn post-param
  [& params]
  (->> (partition 2 params)
       (map
         (fn [[k v]]
           (format "%s=%s"
                   (codec/url-encode (name k))
                   (codec/url-encode v))))
       (string/join "&")
       (.getBytes)))

;; ## Tests

(deftest t-chat
  (let [handler (test-handler)]

    (testing "rendering the chat."
      (let [{:keys [status body]} (handler
                                    {:request-method :get
                                     :uri "/"})]
        (is (= status 200))
        (is (.startsWith body "<!DOCTYPE"))))

    #_(testing "registering a username"
        (let [{:keys [status headers]} (handler
                                         {:request-method :post
                                          :uri "/register"
                                          :headers content-type-header
                                          :body (post-param :username "test")})]
          (is (= status 200))
          (is (= (get headers "Set-Cookie") ["username=test"])))
        (let [{:keys [status headers body]} (handler
                                              {:request-method :post
                                               :uri "/register"
                                               :headers content-type-header
                                               :body (post-param :username "test2")})]
          (is (= status 200))
          (is (= (get headers "Set-Cookie") ["username=test2"]))))

    #_(testing "re-registering using cookie."
        (let [{:keys [status]} (handler
                                 {:request-method :post
                                  :uri "/register"
                                  :headers (username-header "test")})]
          (is (= status 200))))

    #_(testing "registering a taken username"
        (let [{:keys [status]} (handler
                                 {:request-method :post
                                  :uri "/register"
                                  :headers content-type-header
                                  :body (post-param :username "test")})]
          (is (= status 422))))

    #_(testing "registering without username"
        (let [{:keys [status]} (handler
                                 {:request-method :post
                                  :uri "/register"
                                  :headers content-type-header})]
          (is (= status 400))))

    #_(testing "retrieving all messages as JSON (empty)."
        (let [{:keys [status headers body]} (handler
                                              {:request-method :get
                                               :uri "/messages"})]
          (is (= status 200))
          (is (some-> (get headers "content-type")
                      (.startsWith "application/json")))
          (is (= (json/read-str body) []))))

    (testing "sending public messages"

      #_(testing "sending a message without username."
          (let [{:keys [status]} (handler
                                   {:request-method :post
                                    :headers content-type-header
                                    :uri "/send"
                                    :body (post-param :message "hallo")})]
            (is (= status 401)))
          (let [{:keys [status body]} (handler
                                        {:request-method :get
                                         :uri "/messages"})]
            (is (= status 200))
            (is (= (json/read-str body) []))))

      #_(testing "sending messages."
          (dotimes [n 5]
            (let [{:keys [status]} (handler
                                     {:request-method :post
                                      :headers (merge
                                                 content-type-header
                                                 (username-header "test"))
                                      :uri "/send"
                                      :body (post-param :message (str "hallo" n))})]
              (when (= n 0)
                (is (= status 200)))
              (Thread/sleep 10)))
          (let [{:keys [status body]} (handler
                                        {:request-method :get
                                         :uri "/messages"})
                data (json/read-str body :key-fn keyword)]
            (is (= status 200))
            (is (= (count data) 5))
            (doseq [[i msg] (map vector (range) data)]
              (is (= (:username msg) "test"))
              (is (= (:message-string msg) (str "hallo" i)))))))

    (testing "private messages"

      #_(testing "sending a private message."
          (let [{:keys [status body]} (handler
                                        {:request-method :post
                                         :uri "/send-private"
                                         :headers (merge
                                                    content-type-header
                                                    (username-header "test"))
                                         :body (post-param
                                                 :to "test2"
                                                 :message "hallo2")})]
            (is (= status 200))))

      #_(testing "private messages appear to the respective users."
          (are [username] (let [{:keys [status body]} (handler
                                                        {:request-method :get
                                                         :headers (username-header username)
                                                         :uri "/messages"})
                                data (json/read-str body :key-fn keyword)
                                msg (last data)]
                            (is (= status 200))
                            (is (= (count data) 6))
                            (is (= (:username msg) "test > test2"))
                            (is (= (:message-string msg) "hallo2")))
               "test"
               "test2"))

      #_(testing "private messages are hidden from the public."
          (let [{:keys [status body]} (handler
                                        {:request-method :get
                                         :uri "/messages"})
                data (json/read-str body :key-fn keyword)
                msg (last data)]
            (is (= status 200))
            (is (= (count data) 5))
            (is (= (:username msg) "test"))
            (is (= (:message-string msg) "hallo4")))))))
