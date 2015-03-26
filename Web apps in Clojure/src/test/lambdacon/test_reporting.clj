(ns lambdacon.test-reporting
  (:require [clojure.test :refer :all]
            [clojure.data.json :as json]
            [clojure.java.io :as io]
            [org.httpkit.client :as http]))

(defn- participant []
  (when-let [file (io/resource "participant-id")]
    (let [id (slurp file)]
      (if (seq id)
        id
        (do (spit file (java.util.UUID/randomUUID))
            (recur))))))

(defmulti report-to-remote (fn [_ {:keys [type]}] type))

(defmethod report-to-remote :begin-test-var
  [ctx event]
  (reset! ctx (update-in event [:var] #(subs (str %) 2))))

(defmethod report-to-remote :end-test-var
  [ctx event]
  (reset! ctx nil))

(defmethod report-to-remote :default
  [ctx event]
  (when-let [participant-id (participant)]
    (http/post "http://stepien.cc/lambdacon-event"
               {:body (-> event
                          (merge {:ctx @ctx
                                  :participant participant-id
                                  :time (java.util.Date.)})
                          (dissoc :actual)
                          pr-str)})))

(defn- add-reporting [f]
  (let [context (atom nil)
        old-report report]
    (binding [report (fn [event]
                       (report-to-remote context event)
                       (old-report event))]
      (f))))

(defn inject-reporting! []
  (use-fixtures :once add-reporting))
