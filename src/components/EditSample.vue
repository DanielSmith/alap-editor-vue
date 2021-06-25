<template>
  <div class="w-full md:w-full flex flex-row align-middle justify-self-start m-5">
    <Alap :alapConfig="{ alapConfig }"> </Alap>
    <label class="text-gray-700 text-md font-bold p-2 pr-6">Alap Data: </label>
    <input class="p-2 rounded-md w-1/2" aria-label="sample query (such as item ids, or a tag)" v-model="sampledata.linkdata" placeholder="enter sample query (such as item ids, or a .tag)" type="text" />
    <a class="alap text-gray-700 text-md font-bold p-2 pr-6" @click="alapClick" :data-alap-linkitems="sampledata.linkdata">Sample Link....</a>
  </div>
</template>

<script>
import { reactive, ref, provide } from "vue";
import { alapConfig } from "../Config.js";

import { useAlapStore } from "../stores/alap";
import Alap from "./Alap.vue";

export default {
  name: "EditSample",
  components: {
    Alap,
  },

  setup(props, context) {
    const alapStore = useAlapStore();
    const mev = reactive({ count: 1, theEventProperties: {} });

    const sampledata = reactive({ linkdata: ".nyc" });

    provide("mev", mev);

    // click event
    const alapClick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      mev.theEventProperties = {
        target: event.target,
        pageX: event.pageX,
        pageY: event.pageY,
      };
      mev.count++;
    };

    //
    return {
      Alap,
      alapClick,
      alapConfig,
      sampledata,
    };
  },
};
</script>

<style>
</style>