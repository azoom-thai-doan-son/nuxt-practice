<template>
  <div class="user-page">
    <button class="backlink" @click="$router.push({ name: 'posts' })">
      <img src="@/assets/images/back-icon.svg" width="24" height="24" alt="" />
      <h2>Go back</h2>
    </button>
    <v-card width="666">
      <v-card-title primary-title class="title">
        My Info
        <v-icon
          color="blue darken-2"
          large
          :disabled="isEditing"
          @click="isEditing = true"
        >
          mdi-pen
        </v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <form>
          <v-text-field
            v-model="userInfo.username"
            label="Username"
            :error-messages="usernameErrors"
            :readonly="!isEditing"
            @blur="$v.userInfo.username.$touch()"
            @input="$v.userInfo.username.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="userInfo.email"
            @blur="$v.userInfo.email.$touch()"
            @input="$v.userInfo.email.$touch()"
            label="Email"
            :error-messages="emailErrors"
            :readonly="!isEditing"
          ></v-text-field>
          <v-text-field
            v-model="userInfo.phoneNumber"
            label="Phone number"
            :error-messages="phoneNumberErrors"
            :readonly="!isEditing"
            @blur="$v.userInfo.phoneNumber.$touch()"
            @input="$v.userInfo.phoneNumber.$touch()"
          ></v-text-field>

          <DatePicker
            label="Date of Birth"
            v-model="userInfo.dateOfBirth"
            :error-messages="dateOfBirthErrors"
            :readonly="!isEditing"
            @blur="$v.userInfo.dateOfBirth.$touch()"
          />
          <v-radio-group
            v-model="userInfo.gender"
            row
            label="Gender:"
            :error-messages="genderErrors"
            :readonly="!isEditing"
          >
            <v-radio label="Male" value="male"></v-radio>
            <v-radio label="Female" value="female"></v-radio>
          </v-radio-group>
          <div class="footer" v-show="isEditing">
            <v-btn
              :disabled="
                $v.userInfo.$invalid ||
                $v.userInfo.$error ||
                !$v.userInfo.$anyDirty
              "
              @click="submit"
            >
              submit
            </v-btn>
            <v-btn @click="cancel"> Cancel </v-btn>
          </div>
        </form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { minLength, required, email, helpers } from "vuelidate/lib/validators";
import DatePicker from "@/components/DatePicker.vue";
import { commit } from "vuex-pathify";
import {
  requiredError,
  minLengthError,
  emailError,
  phoneNumberError,
} from "@/utils/errorMessages";
const phoneNumber = helpers.regex(
  "phoneNumber",
  /(84|0[3|5|7|8|9])+([0-9]{8})\b/
);

export default {
  name: "UserView",
  components: { DatePicker },
  data() {
    return {
      isEditing: false,
      userInfo: null,
    };
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.userInfo.username.$dirty) return errors;
      !this.$v.userInfo.username.required && errors.push(requiredError);
      !this.$v.userInfo.username.minLength && errors.push(minLengthError(3));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.userInfo.email.$dirty) return errors;
      !this.$v.userInfo.email.required && errors.push(requiredError);
      !this.$v.userInfo.email.email && errors.push(emailError);
      return errors;
    },
    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.userInfo.phoneNumber.$dirty) return errors;
      !this.$v.userInfo.phoneNumber.required && errors.push(requiredError);
      !this.$v.userInfo.phoneNumber.phoneNumber &&
        errors.push(phoneNumberError);
      return errors;
    },

    genderErrors() {
      const errors = [];
      if (!this.$v.userInfo.gender.$dirty) return errors;

      !this.$v.userInfo.gender.required && errors.push(requiredError);
      return errors;
    },
    dateOfBirthErrors() {
      const errors = [];
      if (!this.$v.userInfo.dateOfBirth.$dirty) return errors;

      !this.$v.userInfo.dateOfBirth.required && errors.push(requiredError);
      return errors;
    },
  },
  validations: {
    userInfo: {
      username: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        email,
      },
      phoneNumber: {
        required,
        phoneNumber,
      },
      dateOfBirth: {
        required,
      },
      gender: {
        required,
      },
    },
  },
  methods: {
    cancel() {
      if (this.$v.userInfo.$anyDirty) {
        if (!confirm("You have unsaved changes, do you want to leave?")) {
          return;
        }
      }
      this.userInfo = this.$store.copy("userInfo");
      this.isEditing = false;
      this.$v.userInfo.$reset();
    },
    submit() {
      commit("SET_USER_INFO", this.userInfo);
      this.userInfo = this.$store.copy("userInfo");
      this.$notify({ type: "success", text: "Updated successfully" });
      this.$v.userInfo.$reset();
      this.isEditing = false;
    },
  },
  created() {
    this.userInfo = this.$store.copy("userInfo");
  },
  beforeRouteLeave(to, from, next) {
    if (this.$v.userInfo.$anyDirty) {
      if (!confirm("You have unsaved changes, do you want to leave?")) {
        return;
      }
    }
    next();
  },
};
</script>

<style lang="scss" scoped>
.user-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px;
  > .backlink {
    display: flex;
    align-items: center;
    align-self: flex-start;
    margin-bottom: 24px;
  }
  .title {
    justify-content: space-between;
  }

  .footer {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>
