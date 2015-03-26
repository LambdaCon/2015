# Web Apps in Clojure

Be sure to clone this repository before the workshop and make sure that

    lein test

returns no errors.

Any questions or doubts? Don't hesitate to get in touch.

## Test results reporting

We want to make each of our workshops as effective and productive as we can.
To achieve this goal we need short feedback loops, for example by having an
overview of the progress participants make during the workshop. For that reason
the test suite of this project submits summarised test results to your coach.

We value privacy we keep all data anonymous. It looks as follows:

```clojure
{:time #inst "2015-03-22T12:18:59.337-00:00"
 :participant "aaf72510-f865-4183-bd7d-48702ec1a4fa"
 :ctx {:type :begin-test-var, :var "lambdacon.core-test/t-hello"}
 :type :pass
 :expected (= 404 (:status (request)))
 :message nil}
```

The only identifying piece of information is a random UUID generated during the
first test run. There's no way for us to track it back to a specific person. If
you'de like to see how it works take a look at the `lambdacon.test-reporting`
namespace.

If for whatever reason you don't want to submit test results (which will make it
more difficult for us to conduct the workshop effectively) you can easily
disable reporting. Delete `resources/participant-id` to turn it off. Re-enable
reporting by `git checkout resources/participant-id`.

---

Copyright 2014–2015 Jan Stępień, Yannick Scherer
