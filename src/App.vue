<template>
  <div @dragenter.prevent @dragover.prevent @drop.prevent="handleDrop" @dragend="handleDrop" class="prose prose-xlg px-8 min-w-full bg-green-600">
    <Alap :alapConfig="{ alapConfig }"> </Alap>

    <div v-if="showConfirmDialog" id="dialogBackground" class="dialog-background">
      <dialog class="bg-hex-eee4dd border-gray-200 border-4 rounded-md filter drop-shadow-2xl+" open>
        <p class="p-10 text-center text-2xl">Remove item "{{ removeItemID }}"?</p>

        <div class="flex flex-row w-full p-2 flex-wrap justify-evenly">
          <div class="px-2 space-x-2 mb-2">
            <button class="bg-gray-400 p-1 w-48 px-4 text-teal-900 rounded-2xl" @click="closeDialog('cancel')">Cancel</button>
          </div>
          <div class="px-2 space-x-2">
            <button class="bg-blue-700 p-1 w-48 px-4 hover:text-teal-100 text-white rounded-2xl" @click="closeDialog('confirm')">Ok</button>
          </div>
        </div>
      </dialog>
    </div>

    <div class="flex flex-row col-span-8 justify-center">
      <button @click="newEntryClickHandler" class="add-button bg-blue-700 text-xl filter drop-shadow-2x text-white shadow-2xl p-4 m-6 rounded-2xl text-center">Add new Alap Item</button>
      <button @click="testMenuClickHandler" class="add-button bg-blue-700 text-xl filter drop-shadow-2x text-white shadow-2xl p-4 m-6 rounded-2xl text-center">Toggle Test Menu</button>
    </div>

    <div class="grid grid-cols-12 w-full gap-4">
      <div class="col-start-1 col-span-3 border-green-700 hover:border-green-800 mb-4 border-2 rounded-md">
        <section class="mb-4 p-4">
          <input type="text" @keyup="updateDisplayLinkKeys" placeholder="filter" class="p-2 mt-2 mb-4 rounded w-full" />
          <div v-for="(item, index) in alapStore.filteredKeys" class="border-green-700 hover:border-green-800 mb-4 border-2 flex h-9 items-center hover:text-gray-200 hover-trigger" :key="index">
            <XIcon @click.stop="confirmRemoveEntry(item, $event)" class="hover-target h-5 w-5 mr-2 ml-2 flex-col justify-left text-red-700" />
            <DuplicateIcon @click="cloneEntry(item)" class="hover-target h-5 w-5 flex-col mr-2 justify-left text-green-200" />
            <button class="text-left w-3/4 truncate overflow-ellipsis overflow-hidden" @click="editEntry(item)">{{ item }}</button>
          </div>
        </section>
      </div>

      <div class="col-start-4 col-span-8">
        <section>
          <div v-if="allEditEntries.length === 0 && showTest === false" class="text-2xl ml-6 mt-6 leading-10">
            <p class="w-2/3 mb-4 italic">Note: This DEMO does not save to a database. You can test updates during a session.</p>
            <p class="w-2/3 mb-4">Drag and Drop a link from another browser window here, or click on the Add button above.</p>
            <p class="w-2/3 mb-4">To edit existing items, click on them in the list to the left. Use the filter field on top to narrow down the list</p>
            <p class="w-2/3">You may toggle a test menu on, to see which items will appear (use item ids, or .tags, such as ".sf")</p>
          </div>
          <div v-if="showTest" class="border-green-700 hover:border-green-800 rounded-lg border-2 mb-4">
            <EditSample></EditSample>
          </div>

          <div v-for="(curItem, index) in allEditEntries" class="border-green-700 hover:border-green-800 mb-4 rounded-md border-2" :key="index">
            <EditForm :editInfo="curItem" :label="curItem.label" @updatedItem="processForm" @cancelItem="cancelForm"></EditForm>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
// may not need provide
import { reactive, ref, watch, provide } from "vue";
import { useAlapStore } from "./stores/alap";
import Alap from "./components/Alap.vue";
import EditForm from "./components/EditForm.vue";
import EditSample from "./components/EditSample.vue";
import { alapConfig } from "./Config.js";

import { XIcon, MinusCircleIcon, DuplicateIcon } from "@heroicons/vue/solid";
import ShortUniqueId from "short-unique-id";

export default {
  name: "App",
  components: {
    Alap,
    EditForm,
    EditSample,
    XIcon,
    DuplicateIcon,
  },

  setup(props, context) {
    const alapStore = useAlapStore();

    // may not need this..
    const mev = reactive({ count: 1, theEventProperties: {} });
    provide("mev", mev);

    const allEditEntries = ref([]);
    const showTest = ref(false);

    let entryCounter = 0;
    const editEntryItem = {
      id: null,
      itemID: "",
      label: "",
      url: "",
      tags: "",
      newItem: null,
    };

    // keep track of what is being edited
    const theEditSet = new Set();

    const suid = new ShortUniqueId();
    let inputFilter = "";
    const showConfirmDialog = ref(false);
    const removeItemID = ref();
    const ESC_KEYCODE = 27;

    alapStore.importData(alapConfig);

    const addNewEntry = () => {
      const curEntryItem = reactive(Object.create(editEntryItem));
      curEntryItem.id = entryCounter++;
      curEntryItem.itemID = "_a_new_item_" + suid();
      curEntryItem.originalItemID = curEntryItem.itemID;
      curEntryItem.newItem = true;

      alapStore.alapData.allLinks[curEntryItem.itemID] = curEntryItem;
      allEditEntries.value.unshift(curEntryItem);

      saveData();

      return curEntryItem;
    };

    const removeSample = (id) => {
      allSampleEntries.value = allSampleEntries.value.filter((cur) => cur !== id);
    };

    // do the right thing for clone and new items.. as well as dragged in..
    const processForm = (itemInfo) => {
      const formData = { ...itemInfo };
      let workingItemID = formData.itemID;

      // try to normalize the item id
      workingItemID = workingItemID.replace(/[,\.]+/g, "_");
      workingItemID = workingItemID.toLowerCase().trim().replace(/\s+/g, "_");
      workingItemID = workingItemID.replace(/__+/g, "_");

      // fix up item ID...

      if (formData.newItem === true) {
        if (formData.originalItemID !== workingItemID) {
          delete alapStore.alapData.allLinks[formData.originalItemID];
          removeEditEntry(formData.originalItemID);
          alapStore.alapData.allLinks[workingItemID] = {};
        }
      }
      removeEditEntry(formData.itemID);

      // figure out what to do for a new item

      // who knows what the user (or their cat) may type...
      formData.tags = formData.tags.trim().replace(/\s+/g, ",");
      formData.tags = formData.tags.replace(/,+/g, ",");
      const tagArray = formData.tags.split(/,/);
      const tagFiltered = tagArray.filter((cur) => cur !== "");

      if (!alapStore.alapData.allLinks[workingItemID] || formData.newItem === true) {
        alapStore.alapData.allLinks[workingItemID] = {};
      }

      if (!formData.label) {
        formData.label = "";
      }

      alapStore.alapData.allLinks[workingItemID].label = formData.label.trim();
      alapStore.alapData.allLinks[workingItemID].url = formData.url.trim();
      alapStore.alapData.allLinks[workingItemID].tags = tagFiltered;

      saveData();
    };

    const cancelForm = (itemInfo) => {
      const formData = { ...itemInfo };
      cancelEditEntry(formData.itemID);
    };

    const tagsForDisplay = (tags) => {
      let tagsStr = "";
      // normalize tags somewhere.. so that we dont need to do this check....
      /// also.. tags should be run through a set to assure unique..
      try {
        tagsStr = tags.join(", ");
      } catch {
        tagsStr = tags;
      }

      return tagsStr;
    };

    const editEntry = (item, event) => {
      // alapStore.count++;

      // are we already editing this?
      if (theEditSet.has(item)) {
        console.log("we know " + item);
        return false;
      }

      const curEntryItem = Object.create(alapConfig.allLinks[item]);
      curEntryItem.id = entryCounter++;
      curEntryItem.itemID = item;
      curEntryItem.newItem = false;
      curEntryItem.tags = tagsForDisplay(curEntryItem.tags);

      allEditEntries.value.unshift(curEntryItem);
      theEditSet.add(item);

      return curEntryItem;
    };

    const confirmRemoveEntry = (item, event) => {
      event.preventDefault();

      removeItemID.value = item;
      showConfirmDialog.value = true;
      addListeners();
    };

    const closeDialog = (action) => {
      removeDialog();

      if (action === "confirm") {
        removeEntry(removeItemID.value);

        saveData();
      }
      removeItemID.value = null;
    };

    const removeDialog = () => {
      showConfirmDialog.value = false;
      removeListeners();
    };

    const bodyClickHandler = (event) => {
      let inMenu = event.target.closest("dialog");

      if (!inMenu) {
        removeDialog();
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

    const bodyKeyHandler = (event) => {
      if (event.keyCode == ESC_KEYCODE) {
        removeDialog();
      }
    };

    const removeEntry = (item, event) => {
      removeEditEntry(item);
    };

    // see what we do correct for edit entry and bring that here...
    const cloneEntry = (item, event) => {
      const cloneName = suid();
      const curEntryItem = Object.create(alapConfig.allLinks[item]);
      curEntryItem.id = entryCounter++;
      curEntryItem.itemID = `${item}_copy_${cloneName}`;

      // we expect the user will edit the ID, so we have a copy of the original
      // that we can clean up
      curEntryItem.originalItemID = `${item}_copy_${cloneName}`;
      curEntryItem.newItem = true;

      curEntryItem.tags = tagsForDisplay(curEntryItem.tags);

      alapStore.alapData.allLinks[curEntryItem.itemID] = curEntryItem;
      allEditEntries.value.unshift(curEntryItem);

      saveData();

      return curEntryItem;
    };

    // just updating store
    const updateDisplayLinkKeys = (event) => {
      inputFilter = event.target.value;
      alapStore.setFilter(inputFilter);
    };

    const newEntryClickHandler = (event) => {
      // do we need to do anything special.. or can this just
      // go straight to addNewEntry...
      addNewEntry();
    };

    const testMenuClickHandler = (event) => {
      showTest.value = !showTest.value;
    };

    // perhaps allEditEntires should be in store?
    const removeEditEntry = (item) => {
      theEditSet.delete(item);
      delete alapStore.alapData.allLinks[item];

      allEditEntries.value = allEditEntries.value.filter((cur) => {
        return cur.itemID !== item;
      });
    };

    const cancelEditEntry = (item) => {
      theEditSet.delete(item);

      allEditEntries.value = allEditEntries.value.filter((cur) => {
        return cur.itemID !== item;
      });
    };

    const createTagFromURL = (str) => {
      const url = document.createElement("a");
      url.href = str;

      const elems = url.hostname.split(".");
      elems.pop();
      return elems.join("_");
    };

    // drop event
    const handleDrop = async (event, item) => {
      const theNewEntry = addNewEntry();

      const link = event.dataTransfer.getData("Text");
      try {
        const res = await fetch("/.netlify/functions/get-site-data", {
          method: "POST",
          body: JSON.stringify({ sitelink: link }),
        });

        const data = await res.json();

        theNewEntry.url = data.res.url || link;
        theNewEntry.label = data.res.title;

        theNewEntry.tags = createTagFromURL(theNewEntry.url);
        if (data.res.keywords) {
          theNewEntry.tags += `, ${data.res.keywords}`;
        }
      } catch (err) {
        theNewEntry.label = `failed to get data from ${link}`;
      }
    };

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

    const saveData = async () => {
      const newAlapConfig = { ...alapStore.alapData };
      console.log(newAlapConfig);

      try {
        const res = await fetch("/.netlify/functions/save-data", {
          method: "POST",
          body: JSON.stringify({ alapConfig: newAlapConfig }),
        });

        const data = await res.json();
        console.log(JSON.stringify(data));
      } catch (err) {
        console.log(err);
      }
    };

    return {
      Alap,
      alapClick,
      alapConfig,
      removeItemID,
      removeDialog,
      allEditEntries,

      editEntry,
      cloneEntry,
      confirmRemoveEntry,
      updateDisplayLinkKeys,

      alapStore,

      handleDrop,
      closeDialog,
      newEntryClickHandler,
      testMenuClickHandler,
      showTest,
      showConfirmDialog,

      cancelForm,
      processForm,
      EditForm,
      EditSample,
    };
  },
};
</script>

<style scoped>
.hover-trigger .hover-target {
  visibility: hidden;
}

.hover-trigger:hover .hover-target {
  visibility: visible;
  cursor: pointer;
}

.dialog-background {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 20%;
  width: 60%;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>