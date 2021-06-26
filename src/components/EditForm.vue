<template>
  <div class="w-full">
    <div class="flex p-2 flex-wrap">
      <input v-if="editInfo.originalItemID" type="hidden" v-model="editInfo.originalItemID" />
      <div class="w-full md:w-1/2 p-2">
        <label class="tracking-wide text-gray-700 text-md font-bold mb-2" for="listItemID_' + editInfo.id">Item ID</label>
        <input class="p-2 rounded-md disabled:opacity-60 w-full" aria-label="enter list item id" type="text" placeholder="List th Item ID" v-model="editInfo.itemID" :disabled="!editInfo.newItem" :name="'listItemID_' + editInfo.id" :id="'listItemID_' + editInfo.id" />
      </div>
      <div class="w-full md:w-1/2 p-2">
        <label class="tracking-wide text-gray-700 text-md font-bold mb-2" for="itemLabel_' + editInfo.itemID">Label</label>
        <input class="p-2 rounded-md w-full" aria-label="enter label" type="text" placeholder="label" v-model="editInfo.label" :name="'itemLabel_' + editInfo.id" :id="'itemLabel_' + editInfo.itemID" />
      </div>
    </div>

    <div class="flex p-2 flex-wrap">
      <div class="w-full md:w-1/2 p-2">
        <label class="tracking-wide text-gray-700 text-md font-bold mb-2" for="itemURL_' + editInfo.id">URL</label>
        <input class="p-2 rounded-md w-full" aria-label="enter url" type="text" placeholder="url" v-model="editInfo.url" :name="'itemURL_' + editInfo.id" :id="'itemURL_' + editInfo.id" />
      </div>
      <div class="w-full md:w-1/2 p-2">
        <label class="tracking-wide text-gray-700 text-md font-bold mb-2" for="tagTags_' + editInfo.id">Tags</label>

        <input class="p-2 rounded-md w-full" aria-label="enter tags" type="text" placeholder="tags" v-model="editInfo.tags" :name="'itemTags_' + editInfo.id" :id="'tagTags_' + editInfo.id" />
      </div>
    </div>

    <div class="flex flex-row w-full p-2 flex-wrap justify-evenly">
      <div class="px-2 space-x-2 filter mb-2 drop-shadow-2xl">
        <button class="bg-gray-400 p-1 w-48 px-4 text-teal-900 rounded-2xl" @click="formCancel(editInfo)">Cancel</button>
      </div>
      <div class="px-2 space-x-2">
        <button class="bg-blue-700 p-1 w-48 px-4 hover:drop-shadow-xl hover:text-teal-100 text-white rounded-2xl disabled:opacity-60" :disabled="isCopy" @click="formSubmit(editInfo)">Update Item</button>
      </div>
    </div>
  </div>
</template>


<script>
import { reactive, ref, watch, watchEffect } from "vue";
import { useAlapStore } from "../stores/alap";

export default {
  name: "EditForm",
  emits: ["updatedItem", "cancelItem"],
  props: ["editInfo", "label"],

  setup(props, context) {
    const alapStore = useAlapStore();
    const isCopy = ref(false);

    const originalItemID = props.editInfo.originalItemID || "";

    const formSubmit = (editInfo) => {
      let originalItemID = "";

      if (editInfo.originalItemID) {
        originalItemID = editInfo.originalItemID;

        if (editInfo.itemID !== editInfo.originalItemID && alapStore.alapData.allLinks[editInfo.itemID]) {
          alert(`Item ID: "${editInfo.itemID}" aleady exists, pick a unique name`);
          return;
        }
      }

      const payload = {
        itemID: editInfo.itemID,
        originalItemID: originalItemID,
        label: editInfo.label,
        url: editInfo.url,
        tags: editInfo.tags,
        newItem: editInfo.newItem,
      };
      context.emit("updatedItem", payload);
    };

    const formCancel = (editInfo) => {
      const payload = {
        itemID: editInfo.itemID,
      };
      context.emit("cancelItem", payload);
    };

    return {
      isCopy,
      formSubmit,
      formCancel,
    };
  },
};
</script>

<style scoped>
/* TK */
</style>