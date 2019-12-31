const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.financeUsage = functions.pubsub.schedule("@daily").onRun(context => {
  let data = [];
  let complete = [];
  let sentToFinance = [];
  let inProcess = [];
  let old = [];
  let brad = [];
  let shash = [];
  let rocha = [];
  let miguel = [];
  let whipple = [];
  let kevin = [];
  let francis = [];
  let carolina = [];
  let now = Date.now();
  let day = 86400000;
  let inDay = now - day;
  let completeTime = () => {
    let differences = 0;
    let total = 0;
    complete.forEach(item => {
      differences =
        differences +
        (item.finance.finance_complete_timestamp -
          item.sales.finance_completion_timestamp);
    });
    total = differences / complete.length;
    total = total / 60000;
    total = total / 1440;
    return `${Math.round(total)} days`;
  };
  let query = admin
    .firestore()
    .collection("makeready")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });
    })
    .then(() => {
      data.forEach(item => {
        // # sent to finance today
        if (
          item &&
          item.sales &&
          item.sales.finance_completion_timestamp &&
          item.sales.finance_completion_timestamp >= inDay
        ) {
          sentToFinance.push(item);
        }

        // # completed in finance today
        if (
          item &&
          item.finance &&
          item.finance.finance_complete_timestamp &&
          item.finance.finance_complete_timestamp >= inDay
        ) {
          complete.push(item);
        }

        // # in finance queue currently
        if (
          item &&
          item.states &&
          item.states.finance_state &&
          item.states.finance_state === true
        ) {
          inProcess.push(item);
        }

        // # older than 24 hours
        if (
          item &&
          item.states &&
          item.states.finance_state &&
          item.states.finance_state === true &&
          item.sales.finance_completion_timestamp < inDay
        ) {
          old.push(item);
        }

        // # complete per associate
        if (
          item &&
          item.finance &&
          item.finance.finance_complete_timestamp &&
          item.finance.finance_complete_timestamp >= inDay
        ) {
          if (item.finance.finance_associate === "Shashwat Devu") {
            shash.push(item);
          } else if (item.finance.finance_associate === "Brad Lilley") {
            brad.push(item);
          } else if (item.finance.finance_associate === "Rolando Rocha") {
            rocha.push(item);
          } else if (item.finance.finance_associate === "Miguel Valdez") {
            miguel.push(item);
          } else if (item.finance.finance_associate === "Michael Whipple") {
            whipple.push(item);
          } else if (item.finance.finance_associate === "Kevin Fitzgerald") {
            kevin.push(item);
          } else if (item.finance.finance_associate === "Francis Macias") {
            francis.push(item);
          } else if (item.finance.finance_associate === "Carolina Sanchez") {
            carolina.push(item);
          }
        }
      });
      admin
        .firestore()
        .collection("mail")
        .add({
          to: "bbarton@principleauto.com",
          cc: "james.shiflett@principleauto.com",
          message: {
            subject: `BMW Sold Units: Finance Daily Usage Report - ${new Date().toLocaleDateString()}`,
            html: `
            <div>
              <h3>BMW Sold Units: Finance Queue (last 24 hours)</h3>
            </div>
            <div>
              <h4>
                Currently in Queue: ${inProcess.length}
              </h4>
            </div>
            <div>
              <h4>
                Over 24 Hours Old: ${old.length}
              </h4>
            </div>
            <div>
              <h4>
                Sent to Finance: ${sentToFinance.length}
              </h4>
            </div>
            <div>
              <h4>
                Completed: ${complete.length}
              </h4>
            </div>
            <div>
            <h4>
              Avg. Complete Time: ${completeTime()}
            </h4>
          </div>
            <div>
            <table style='text-align: center'>
              <tr>
                <th>Associate</th>
                <th># Completed</th>
              </tr>
              <tr>
                <td>Brad Lilley</td>
                <td><b>${brad.length}</b></td>
              </tr>
              <tr>
                <td>Shashwat Devu</td>
                <td><b>${shash.length}</b></td>
              </tr>
              <tr>
                <td>Rolando Rocha</td>
                <td><b>${rocha.length}</b></td>
              </tr>
              <tr>
                <td>Miguel Valdez</td>
                <td><b>${miguel.length}</b></td>
              </tr>
              <tr>
                <td>Michael Whipple</td>
                <td><b>${whipple.length}</b></td>
              </tr>
              <tr>
                <td>Kevin Fitzgerald</td>
                <td><b>${kevin.length}</b></td>
              </tr>
              <tr>
                <td>Francis Macias</td>
                <td><b>${francis.length}</b></td>
              </tr>
              <tr>
                <td>Carolina Sanchez</td>
                <td><b>${carolina.length}</b></td>
              </tr>
            </table>`
          }
        });
      return 0;
    })
    .catch(error => {
      console.error(error);
      return 0;
    });
  return query;
});
