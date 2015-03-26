(ns lambdacon.state-test
  (:require [clojure.test :refer :all]
            [lambdacon.test-reporting :refer [inject-reporting!]]
            [lambdacon.state :refer :all]))

(inject-reporting!)

;; ## Message Stores

(defn make-msg
  [s]
  (Thread/sleep 2)
  (map->Message
    {:username "lambdacon"
     :timestamp (System/currentTimeMillis)
     :message-string s}))

(def test-count 5)

(def test-messages
  (->> ["hello, lambdacon!"
        "hello, poland!"
        "hello, world!"]
       (cycle)
       (take test-count)
       (mapv make-msg)))

(defn- parallel-store!
  [store messages]
  (dorun
    (->> messages
         (mapv #(future (store-message! store %)))
         (map deref))))

(defn- messages=
  [m0 m1]
  (= (map #(into {} %) m0)
     (map #(into {} %) m1)))

(deftest t-atom-message-store
  (testing "atom-based message store"
    (let [store (atom-message-store)]

      (testing "- protocol is satisfied."
        (is (satisfies? MessageStore store)))

      #_(testing "- the store is initially empty."
          (is (empty? (messages store))))

      #_(testing "- parallel message storage."
          (parallel-store! store test-messages)
          (let [msgs (messages store)]
            (is (messages= (sort-by :timestamp msgs) test-messages))))

      #_(testing "- observers."
          (let [data (atom nil)]
            (register-observer! store #(reset! data %))
            (store-message! store (first test-messages))
            (= @data (first test-messages))))

      #_(testing "- clearing the store."
          (clear-messages! store)
          (is (empty? (messages store)))))))

(deftest t-read-write-message
  (let [f (create-temporary-file!)]
    (try
      (let [msg (first test-messages)]
        (append-message! f msg)
        (append-message! f msg)
        (is (messages= (read-messages! f) [msg msg])))
      (finally
        (.delete f)))))

(deftest t-call-observers
  (let [data (atom [])
        o #(swap! data conj %)
        os (repeat 10 o)
        msg (first test-messages)]
    (call-observers! os msg)
    (= (count @data) 10)
    (messages= (distinct @data) [msg])))

(deftest t-file-message-store
  (testing "file-based message store"
    (let [f (create-temporary-file!)
          store (file-message-store f)]
      (try
        (testing "- protocol is satisfied."
          (is (satisfies? MessageStore store)))

        #_(testing "- the store is initially empty."
            (is (empty? (messages store))))

        #_(testing "- parallel message storage."
            (parallel-store! store test-messages)
            (let [msgs (messages store)]
              (is (messages= (sort-by :timestamp msgs) test-messages))))

        #_(testing "- storage persistence."
            (let [store' (file-message-store f)
                  msgs (messages store)]
              (is (messages= (sort-by :timestamp msgs) test-messages))))

        #_(testing "- observers."
            (let [data (atom nil)]
              (register-observer! store #(reset! data %))
              (store-message! store (first test-messages))
              (= @data (first test-messages))))

        #_(testing "- clearing the store."
            (clear-messages! store)
            (is (empty? (messages store)))
            (is (empty? (messages (file-message-store f)))))

        (finally
          (.delete f))))))

;; ## User Store

(deftest t-user-store
  (testing "user store."
    (let [store (user-store #'atom-message-store)]

      (testing "- satisfies protocol."
        (is (satisfies? UserStore store)))

      #_(testing "- user storage."
          (let [u (add-user! store "lambdacon")]
            (is (= (user-by-username store "lambdacon") u)))
          #_(testing "- conflicting usernames."
              (is (not (add-user! store "lambdacon")))))

      #_(testing "- user removal."
          (is (not (nil? (user-by-username store "lambdacon"))))
          (remove-user! store "lambdacon")
          (is (nil? (user-by-username store "lambdacon")))))))
