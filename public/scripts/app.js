var switchInput = document.getElementById("switch");
var APIurl = "http://localhost:5000";

function on() {
  return new Promise((resolve, reject) => {
    fetch(APIurl + "/on", {
      method: "post"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        resolve(data.result);
      });
    reject(false);
  });
}

function off() {
  return new Promise((resolve, reject) => {
    fetch(APIurl + "/off", {
      method: "post"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        resolve(data.result);
      })
      .catch(err => {
        console.error(err);
      });
    reject(false);
  });
}

switchInput.addEventListener("change", () => {
  let state = switchInput.checked;

  if (state) {
    on()
      .then(result => {
        console.log(result);
        if (result == false) {
          switchInput.checked == false;
        } else {
          switchInput.checked == true;
        }
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    off()
      .then(result => {
        console.log(result);
        if (result == true) {
          switchInput.checked == true;
        } else {
          switchInput.checked == false;
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
});
