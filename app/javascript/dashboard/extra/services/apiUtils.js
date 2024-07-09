import axios from "axios";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },
  methods: {
     existsMenuOption(optionMenu) {
      const { access_token, account_id } = this.currentUser;
      // const data = {
      //   api_access_token: access_token,
      //   account_id: account_id,
      //   option: optionMenu
      // };
      const response =  axios.get(process.env.URL_WEBHOOK + "/api/getExistsMenuOption", { 
          params: {
            api_access_token: access_token,
            account_id      : account_id,
            option          : optionMenu,
          }
        })
        .then(function (resp) { return resp.data; })
        .catch(function (error) { return error; });

        if (response.status === 302 ){
          return true;
        }  
        return false;

      // const { access_token, account_id } = this.currentUser;
      // console.log("Valores>",access_token, account_id);
      // const data = JSON.stringify({
      //   api_access_token: access_token,
      //   account_id: account_id,
      //   option: optionMenu
      // });

      // console.log("Data>",data);

      // const config = {
      //   method: "get",
      //   url: process.env.URL_WEBHOOK + "/api/getExistsMenuOption",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };

      // await axios(config)
      //   .then(function (response) {
      //     console.log('response.status > ',response.status);
      //     console.log('response.data.status >',response.data.status);
      //     if (response.data.status === 302) {
      //       return true;
      //     }
      //     return false;
      //   })
      //   .catch(function (error) {
      //   });
    },
  },
};
