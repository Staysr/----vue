<template>
  <div class="card">
    <!-- v-for="(item, index) in animation"
      :key="index" -->
    <card-list :maindata-item="maindata" :count="count"></card-list>
  </div>
</template>

<script>
import CardList from "./CardList";

export default {
  name: "Card",
  components: {
    CardList,
  },
  props: {
    maindata: {
      type: Array,
      default() {
        return [];
      },
    },
	count:{
		type: Number,
	}
  },
};
</script>

<style scoped>
</style>