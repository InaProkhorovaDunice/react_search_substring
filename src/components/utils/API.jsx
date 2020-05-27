import axios from 'axios';

export default {
  logOut: () => {
    return axios.delete('/auth/sign_out', {headers: {"uid": localStorage.getItem("uid"), client: localStorage.getItem("client"), 'access-token': localStorage.getItem("access-token")}})
                         .then(res => {
                             localStorage.setItem('uid', '');
                             localStorage.setItem('client', '');
                             localStorage.setItem('access-token', '');
                             localStorage.setItem('password', '');
                             localStorage.setItem('request-error', false)
                         })
                         .catch((error) => localStorage.setItem('request-error', true))
  },
  logIn: (email, password) => {
      return axios.post('/auth/sign_in', {email: email, password: password})
                         .then(res => {
                             localStorage.setItem('uid', res.headers.uid);
                             localStorage.setItem('client', res.headers.client);
                             localStorage.setItem('access-token', res.headers['access-token']);
                             localStorage.setItem('password', password);
                             localStorage.setItem('request-error', false)
                         })
                         .catch((error) => localStorage.setItem('request-error', true))
    },
    signUp: (email, password, passwordConfirmation) => {
          return axios.post('/auth', {email: email, password: password, password_confirmation: passwordConfirmation})
                             .then(res => {
                                 localStorage.setItem('uid', res.headers.uid);
                                 localStorage.setItem('client', res.headers.client);
                                 localStorage.setItem('access-token', res.headers['access-token']);
                                 localStorage.setItem('password', password);
                                 localStorage.setItem('request-error', false)
                             })
                             .catch((error) => localStorage.setItem('request-error', true))
        },
    resetPassword: (password, passwordConfirmation) => {
                  return axios.put('/auth/password', {password: password, password_confirmation: passwordConfirmation}, {headers: {"uid": localStorage.getItem("uid"), client: localStorage.getItem("client"), 'access-token': localStorage.getItem("access-token")}} )
                                     .then(res => {
                                         localStorage.setItem('request-error', false);
                                         localStorage.setItem('password', 'password');
                                     })
                                     .catch((error) => localStorage.setItem('request-error', true))
        },
    searchSubstring: (searchString, substring) => {
                              return axios.post('/request/new_request',
                                                 {request: {search_string: searchString, substring: substring}},
                                                 {headers: {"uid": localStorage.getItem("uid"), client: localStorage.getItem("client"), 'access-token': localStorage.getItem("access-token")}})
                                                 .then(res => {
                                                 localStorage.setItem('request-error', false);
                                                 localStorage.setItem('searchResult', JSON.stringify(res.data));
                                                 })
                                                 .catch((error) => localStorage.setItem('request-error', true))
                    },
    gerRequestHistory: (searchString, substring) => {
                              return axios.get('/request/', {headers: {uid: localStorage.getItem("uid"), client: localStorage.getItem("client"), 'access-token': localStorage.getItem("access-token")}})
                                                 .then(res => {
                                                     localStorage.setItem('request-error', false);
                                                     localStorage.setItem('requestHistory', JSON.stringify(res.data));
                                                 })
                    },
    deleteSearchRequest: (id) => {
                              return axios.delete('/request/delete_request',  {headers: {"uid": localStorage.getItem("uid"), client: localStorage.getItem("client"), 'access-token': localStorage.getItem("access-token")}, params: {id: id}})
                                                 .then(res => {
                                                    localStorage.setItem('request-error', false);
                                                 })
                                                 .catch((error) => localStorage.setItem('request-error', true))
                    },

  otherApiCall: (params) => {
  }
}

