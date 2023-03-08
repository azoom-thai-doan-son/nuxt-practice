<template>
  <div>
    <v-menu
      v-model="isOpening"
      :close-on-content-click="false"
      :nudge-right="40"
      :disabled="readonly"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :label="label"
          readonly
          :value="formattedDate"
          v-on="on"
          :error-messages="errorMessages"
          @blur="$emit('blur')"
        ></v-text-field>
      </template>
      <v-date-picker
        locale="en-in"
        :min="minDate"
        :max="maxDate"
        :value="value"
        no-title
        @input="pickDate"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isOpening: false,

      minDate: '1999-01-01',
      maxDate: new Date().toJSON().slice(0, 10),
    };
  },
  props: ['label', 'value', 'errorMessages', 'readonly'],

  computed: {
    formattedDate() {
      return this.value;
    },
  },
  methods: {
    pickDate(date) {
      this.$emit('input', date);
      this.isOpening = false;
    },
  },
};
</script>
