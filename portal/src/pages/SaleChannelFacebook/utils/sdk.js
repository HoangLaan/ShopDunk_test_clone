const facebookAppId = 447161390213437;

export function initFacebookSdk() {
  return new Promise((resolve) => {
    // wait for facebook sdk to initialize before starting the react app
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v14.0',
      });

      // auto authenticate with the api if already logged in with facebook
      window.FB.getLoginStatus(({ authResponse }) => {
        if (authResponse) {
          resolve();
        } else {
          resolve();
        }
      });
    };

    // load facebook sdk script
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  });
}

export function login() {
  // login with facebook then authenticate with the API to get a JWT auth token
  return new Promise((resolve) => {
    window.FB.login(
      (response) => {
        console.log(response);
        resolve(response);
      },
      {
        scope:
          'pages_show_list,public_profile,email, pages_messaging,read_mailbox , pages_read_user_content, pages_manage_metadata, pages_read_engagement ',
      },
    );
  });
}

export async function logout() {
  // login with facebook then authenticate with the API to get a JWT auth token
  await new Promise((resolve) => {
    window.FB.logout((response) => {
      resolve(response);
    });
  });
}

export const request = (...params) => {
  return new Promise((resolve) => {
    const callback = (response) => {
      resolve(response);
    };
    params.push(callback);
    window.FB.api(...params);
  });
};
