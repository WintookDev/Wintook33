import axios from "axios";
export default {
  data() {
    return {
      dataCRMSync: {},
      dataAccount: {},
    };
  },
  methods: {
    showAlert(message, action) {
      bus.$emit('newToastMessage', message, action);
    },

    async getCRMZeusSync() {
      const { account_id } = this.dataAccount;
      var options = {
        method: 'GET',
        url: `https://api-dev.wintook.com/v1/accounts/33445566778899/getCRMZeusSync/${account_id}`,
        headers: {}
      };

      const data = await axios.request(options).then(function (response) {
        return (response.data);
      }).catch(function (error) {
        console.error(error);
      });
      return data;
    },

    async findByPhoneNumberCRM(phone_number) {
      const { crm_token, crm_url } = this.dataCRMSync;
      const phoneNumber = phone_number.slice(-10);
      const options = {
        method: 'POST',
        url: `${crm_url}apiCrm/externalAccess/accessToken/api/v1/contact/find_Contacto`,
        headers: {
          'Content-Type': 'application/json',
          api_access_token: crm_token,
        },
        data: { TELEFONO: phoneNumber }
      };

      const data = await axios.request(options).then(function (response) {
        return (response.data[0]);
      }).catch(function (error) {
        console.error(error);
      });
      return ( data );
    },

    async findByEmailCRM(dataCRMSync, email) {
      const { crm_token, crm_url } = dataCRMSync;
      const options = {
        method: 'POST',
        url: `${crm_url}apiCrm/externalAccess/accessToken/api/v1/contact/find_Contacto`,
        headers: {
          'Content-Type': 'application/json',
          api_access_token: crm_token,
        },
        data: { EMAIL: email }
      };

      const data = await axios.request(options).then(function (response) {
        return (response.data[0]);
      }).catch(function (error) {
        console.error(error);
      });
      return (data);
    },



    /* ----------------------------------------------
      getContact -> Obtener un contacto desde Wintook
      -----------------------------------------------*/
    async getContact(  ){
      const { account_id, contact_id, access_token } = this.dataAccount;
      const options = {
        method: 'GET',
        url: `https://dev.wintook.com/api/v1/accounts/${account_id}/contacts/${contact_id}`,

        headers: {
          'Content-Type': 'application/json',
          api_access_token: access_token,
        },
        data: {}
      };

      const contact = await axios.request(options).then(function (response) {
        return (response.data);
      }).catch(function (error) {
        console.error(error);
      });
      return (contact.payload);
    },
    /* ----------------------------------------------*/


    /* ----------------------------------------------
      getContact -> Obtener un contacto desde Wintook
      -----------------------------------------------*/
      async updateContact( idOrg, idContact ){
        const { account_id, contact_id, access_token } = this.dataAccount;
        const options = {
        method: 'PUT',
        url: `https://dev.wintook.com/api/v1/accounts/${account_id}/contacts/${contact_id}`,
        headers: {
          'Content-Type': 'application/json',
          api_access_token: access_token,
        },
        data: {
          custom_attributes: {
            dataSync: { idOrg, idContact }
          }
        }
      };

      axios.request(options).then(function (response) {
        bus.$emit('newToastMessage', 'Contacto sincronizado con CRMZeus satisfactoriamente!!');
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
      },
      /* ----------------------------------------------*/


    async dataSyncCRM(dataAccount) {
      this.dataAccount =  dataAccount;
      const { org_id } = this.dataAccount;

      this.dataCRMSync  = await this.getCRMZeusSync();
      const { crm_active } = this.dataCRMSync;
      if (!crm_active) return false;

      const datContact = await this.getContact();
      
      const { custom_attributes, additional_attributes, phone_number } = datContact;
      const { company_name } = additional_attributes;
      const { dataSync = { idOrg : 0, idContact : 0 }} = custom_attributes;
      const { idOrg, idContact } = dataSync;

      console.log(`custom_attributes > ${custom_attributes}`);
      console.log(`additional_attributes > ${additional_attributes}`);
      console.log(`phone_number > ${phone_number}`);
      console.log(`dataSync > ${dataSync}`);
      console.log(`company_name > ${company_name}`);

      console.log(`idOrg > ${idOrg}`);
      console.log(`idContact > ${idContact}`);

      /*-> Condiciones para buscar el contacto en CRMZeus por phone_number o email. <-*/
      if ( !idOrg && !idContact && !org_id && !company_name.length && phone_number.length) {
        console.log("Esta en la de");
        const contact_crm = await this.findByPhoneNumberCRM(phone_number);
        const { CLIENTE_ID = 0, CONTACTO_CONTACTO_ID = 0 } = contact_crm;
        if ( CLIENTE_ID && CONTACTO_CONTACTO_ID  ) {
          await this.updateContact( CLIENTE_ID, CONTACTO_CONTACTO_ID );
          console.log( CLIENTE_ID, CONTACTO_CONTACTO_ID );
          return true;
        }
      } 



      // else if (!idOrg && !idContact && !org_id && company_name.length) {
      //   bus.$emit('newToastMessage', 'Guardar conatcto con nueva organización y actualizar dataSync!!');
      // }
    },

  },
};
