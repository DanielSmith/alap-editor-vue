<template>
  <div v-if="showAlapElem" id="alapelem" class="alapelem text-gray-700 text-md font-bold p-2 pr-6" @mouseleave="menuMouseLeaveHandler" @mouseenter="menuMouseEnterHandler" :style="styleObject">
    <ul>
      <li v-for="(target, index) in ed.theTargets" :key="index">
        <a target="fromAlap" :class="ed.allLinks[target].cssClass" :href="ed.allLinks[target].url">{{ ed.allLinks[target].label }}</a>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { onMounted, defineProps, watch, ref, inject } from "vue";
import alap from "alap";

const props = defineProps({
  alapConfig: Object,
});

const ESC_KEYCODE = 27;
const menuTimeout = 3000;
const styleObject = ref({
  top: 0,
  left: 0,
});

// may be able to get rid of this
const curData = ref("unknown");

let curTimerID = null;

const mev = inject("mev");
let myAlap;
let showAlapElem = ref(false);
const ed = ref({});

const removeMenu = () => {
  removeListeners();
  showAlapElem.value = false;
};

const bodyClickHandler = (event) => {
  let inMenu = event.target.closest("#alapelem");

  if (!inMenu) {
    removeMenu();
  }
};

const bodyKeyHandler = (event) => {
  if (event.keyCode == ESC_KEYCODE) {
    removeMenu();
  }
};

const removeListeners = () => {
  document.body.removeEventListener("click", bodyClickHandler);
  document.body.removeEventListener("keydown", bodyKeyHandler);
};

const addListeners = () => {
  document.body.addEventListener("click", bodyClickHandler);
  document.body.addEventListener("keydown", bodyKeyHandler);
};

const menuMouseLeaveHandler = (event) => {
  startTimer();
};

const menuMouseEnterHandler = (event) => {
  stopTimer();
};

const startTimer = () => {
  if (curTimerID) {
    clearTimeout(curTimerID);
  }
  curTimerID = setTimeout(removeMenu, menuTimeout);
};

const stopTimer = () => {
  clearTimeout(curTimerID);
  curTimerID = null;
};

watch(
  () => mev.count,
  (_1, _2) => {
    const myattr = { ...mev };

    showAlapElem.value = true;

    // we deliberately keep listeners to a minimum.. only
    // active while the menu is up, and taking pains to
    // remove strays
    removeListeners();
    addListeners();
    startTimer();

    if (myattr.theEventProperties.target) {
      // the parameter passing is a workaround for a bug...
      ed.value = myAlap.processEvent(myattr.theEventProperties, {
        ...props.alapConfig.alapConfig,
      });

      styleObject.value.top = ed.value.offset.top + "px";
      styleObject.value.left = ed.value.offset.left + "px";
      curData.value = ed.theData;
    }
  }
);

onMounted(() => {
  myAlap = new alap();
  myAlap.configure({ ...props.alapConfig }, "vue");
  myAlap.dumpConfig();
});
</script>

<style>
a {
  color: #42b983;
}

.alapelem {
  position: absolute;
  z-index: 10;
  margin-top: 1.5rem;
  margin-left: 0px;
  background-color: #170707;
  padding-right: 5px;
  padding-left: 0px;
  border: 2px solid white;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.25) 5px 5px 9px;
  color: #1c2419;
  width: auto;
}
</style>
