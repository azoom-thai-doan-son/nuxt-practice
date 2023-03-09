<template>
  <div class="auth-page">
    <Loading :active="isLoading" :is-full-page="true"></Loading>
    <v-tabs centered grow v-model="tab">
      <v-tab>Login</v-tab>
      <v-tab-item>
        <form>
          <v-text-field
            v-model="loginInfo.user"
            label="Email/Phone number"
            @blur="$v.loginInfo.user.$touch()"
            :error-messages="userLoginErrors"
          ></v-text-field>
          <v-text-field
            v-model="loginInfo.password"
            label="Password"
            type="password"
            @blur="$v.loginInfo.password.$touch()"
            :error-messages="passwordLoginErrors"
          ></v-text-field>
          <div class="footer">
            <v-btn
              @click="login"
              :disabled="$v.loginInfo.$invalid || $v.loginInfo.$error"
            >
              submit
            </v-btn>
            <v-btn @click="clearLoginInfo"> clear </v-btn>
          </div>
        </form>
      </v-tab-item>
      <v-tab>Register</v-tab>
      <v-tab-item>
        <form>
          <v-text-field
            v-model="registerInfo.username"
            label="Username"
            :error-messages="usernameErrors"
            @blur="$v.registerInfo.username.$touch()"
          ></v-text-field>
          <v-text-field
            :error-messages="emailErrors"
            v-model="registerInfo.email"
            @blur="$v.registerInfo.email.$touch()"
            label="Email"
          ></v-text-field>
          <v-text-field
            v-model="registerInfo.phoneNumber"
            label="Phone number"
            :error-messages="phoneNumberErrors"
            @blur="$v.registerInfo.phoneNumber.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="registerInfo.password"
            :error-messages="passwordErrors"
            label="Password"
            type="password"
            @blur="$v.registerInfo.password.$touch()"
          ></v-text-field>
          <v-text-field
            :error-messages="confirmPasswordErrors"
            v-model="registerInfo.confirmPassword"
            label="Confirm Password"
            type="password"
            @blur="$v.registerInfo.confirmPassword.$touch()"
          ></v-text-field>
          <DatePicker
            label="Date of Birth"
            v-model="registerInfo.dateOfBirth"
            :error-messages="dateOfBirthErrors"
            @blur="$v.registerInfo.dateOfBirth.$touch()"
          />
          <v-radio-group
            v-model="registerInfo.gender"
            row
            label="Gender:"
            :error-messages="genderErrors"
          >
            <v-radio label="Male" value="male"></v-radio>
            <v-radio label="Female" value="female"></v-radio>
          </v-radio-group>
          <div class="footer">
            <v-btn
              :disabled="$v.registerInfo.$invalid || $v.registerInfo.$error"
              @click="register"
            >
              submit
            </v-btn>
            <v-btn @click="clearRegisterInfo"> clear </v-btn>
          </div>
        </form>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { db, auth, usersCollection } from "@/plugins/firebase";
import ky from "@/plugins/ky";
import DatePicker from "@/components/DatePicker.vue";
import {
  minLength,
  required,
  email,
  helpers,
  sameAs,
  or,
} from "vuelidate/lib/validators";
import {
  requiredError,
  minLengthError,
  emailError,
  phoneNumberError,
  passwordError,
  confirmPasswordError,
  emailOrPhoneNumberError,
} from "@/utils/errorMessages";
import { commit, get } from "vuex-pathify";

const phoneNumber = helpers.regex(
  "phoneNumber",
  /(84|0[3|5|7|8|9])+([0-9]{8})\b/
);

export default {
  components: { DatePicker },
  data() {
    return {
      tab: null,
      loginInfo: {
        user: "",
        password: "",
      },
      registerInfo: {
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        gender: null,
      },
    };
  },
  validations: {
    loginInfo: {
      user: {
        required,
        emailOrPhoneNumber: or(email, phoneNumber),
      },
      password: {
        required,
        minLength: minLength(8),
      },
    },
    registerInfo: {
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
      password: {
        required,
        password: helpers.regex(
          "password",
          /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).*$/
        ),
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
      dateOfBirth: {
        required,
      },
      gender: {
        required,
      },
    },
  },
  computed: {
    isLoading: get("isLoading"),
    usernameErrors() {
      const errors = [];
      if (!this.$v.registerInfo.username.$dirty) return errors;
      !this.$v.registerInfo.username.required && errors.push(requiredError);
      !this.$v.registerInfo.username.minLength &&
        errors.push(minLengthError(3));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.registerInfo.email.$dirty) return errors;
      !this.$v.registerInfo.email.required && errors.push(requiredError);
      !this.$v.registerInfo.email.email && errors.push(emailError);
      return errors;
    },
    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.registerInfo.phoneNumber.$dirty) return errors;
      !this.$v.registerInfo.phoneNumber.required && errors.push(requiredError);
      !this.$v.registerInfo.phoneNumber.phoneNumber &&
        errors.push(phoneNumberError);
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.registerInfo.password.$dirty) return errors;
      !this.$v.registerInfo.password.required && errors.push(requiredError);
      !this.$v.registerInfo.password.password && errors.push(passwordError);

      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.registerInfo.confirmPassword.$dirty) return errors;
      !this.$v.registerInfo.confirmPassword.required &&
        errors.push(requiredError);
      !this.$v.registerInfo.confirmPassword.sameAsPassword &&
        errors.push(confirmPasswordError);
      return errors;
    },
    genderErrors() {
      const errors = [];
      if (!this.$v.registerInfo.gender.$dirty) return errors;

      !this.$v.registerInfo.gender.required && errors.push(requiredError);
      return errors;
    },
    dateOfBirthErrors() {
      const errors = [];
      if (!this.$v.registerInfo.dateOfBirth.$dirty) return errors;

      !this.$v.registerInfo.dateOfBirth.required && errors.push(requiredError);
      return errors;
    },
    userLoginErrors() {
      const errors = [];
      if (!this.$v.loginInfo.user.$dirty) return errors;

      !this.$v.loginInfo.user.required && errors.push(requiredError);
      !this.$v.loginInfo.user.emailOrPhoneNumber &&
        errors.push(emailOrPhoneNumberError);
      return errors;
    },
    passwordLoginErrors() {
      const errors = [];
      if (!this.$v.loginInfo.password.$dirty) return errors;

      !this.$v.loginInfo.password.required && errors.push(requiredError);
      !this.$v.loginInfo.password.minLength && errors.push(minLengthError(8));
      return errors;
    },
  },
  methods: {
    // validate users info by using their email
    async login() {
      commit("SET_IS_LOADING", true);
      const { user, password } = this.loginInfo;
      try {
        const credential = await auth.signInWithEmailAndPassword(
          user,
          password
        );

        const res = await usersCollection.doc(credential.user.uid).get();
        console.log("res", res.data());
        commit("SET_USER_INFO", {
          ...res.data(),
        });
        this.$router.push({ name: "posts" });

        this.$notify({
          type: "success",
          text: "Login successfully!",
        });
      } catch (error) {
        this.$notify({ type: "error", text: error });
      }
      commit("SET_IS_LOADING", false);
    },
    clearLoginInfo() {
      this.$v.loginInfo.$reset();
      this.loginInfo.user = "";
      this.loginInfo.password = "";
    },
    async register() {
      const { username, email, phoneNumber, password, gender, dateOfBirth } =
        this.registerInfo;
      try {
        commit("SET_IS_LOADING", true);
        const credential = await auth.createUserWithEmailAndPassword(
          email,
          password
        );

        await usersCollection.doc(credential.user.uid).set({
          username,
          email,
          phoneNumber,
          gender,
          dateOfBirth,
        });
        await credential.user.updateProfile({
          displayName: username,
        });
        console.log(credential);

        commit("SET_USER_INFO", {
          username,
          email,
          phoneNumber,
          gender,
          dateOfBirth,
        });
        this.$router.push({ name: "posts" });
        this.$notify({
          type: "success",
          text: "Register successfully",
        });
      } catch (error) {
        this.$notify({
          type: "error",
          text: error,
        });
      } finally {
        commit("SET_IS_LOADING", false);
      }
    },
    clearRegisterInfo() {
      this.$v.registerInfo.$reset();
      this.registerInfo.username = "";
      this.registerInfo.email = "";
      this.registerInfo.phoneNumber = "";
      this.registerInfo.password = "";
      this.registerInfo.confirmPassword = "";
      this.registerInfo.dateOfBirth = "";
      this.registerInfo.gender = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-page {
  padding: 64px;
  .v-tabs {
    max-width: 666px;
    margin: 0 auto;
    border-radius: 8px 8px 0 0;
  }

  ::v-deep .v-window {
    border-radius: 0 0 8px 8px;
  }
  .v-window-item {
    padding: 16px;
  }
  .footer {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
}
</style>
