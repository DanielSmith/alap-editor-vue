// usiing the Pinia store for globally shared state
import { defineStore } from "pinia";

export const useAlapStore = defineStore({
  id: "alapstore",
  state: () => {
    return {
      alapData: {},
      displayFilter: "",
      count: 0,
    };
  },

  actions: {
    increment() {
      this.count++;
    },

    importData(data) {
      this.alapData = data;
    },

    setFilter(inputFilter) {
      if (!inputFilter || inputFilter.trim().length === 0) {
        this.displayFilter = "";
      } else {
        this.displayFilter = inputFilter;
      }
    },
  },

  getters: {
    // TK
    getKeys() {
      return Object.keys(this.alapData.allLinks);
    },

    filteredKeys() {
      if (this.displayFilter === "") {
        return Object.keys(this.alapData.allLinks).sort();
      } else {
        return Object.keys(this.alapData.allLinks)
          .sort()
          .filter((item) => item.toLowerCase().includes(this.displayFilter.toLowerCase()));
      }
    },
  },
});
