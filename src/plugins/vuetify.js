import Vue from "vue";
import {
  Vuetify,
  VApp,
  VBtn,
  VChip,
  VDataTable,
  VDatePicker,
  VDialog,
  VDivider,
  VForm,
  VGrid,
  VIcon,
  VMenu,
  VSelect,
  VTextarea,
  VTextField,
  VTimePicker,
  VToolbar,
  VTooltip,
  transitions
} from "vuetify";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VChip,
    VDataTable,
    VDatePicker,
    VDialog,
    VDivider,
    VForm,
    VGrid,
    VIcon,
    VMenu,
    VSelect,
    VTextarea,
    VTextField,
    VTimePicker,
    VToolbar,
    VTooltip,
    transitions
  },
  theme: {
    primary: "#791F5E",
    secondary: "#0E69A4"
  }
});
