/**
 * Home Component
 */

<style lang="scss">

@import "../../scss/libs";

div.home {
	color: blue;
}
</style>

<template>
	<div class="home">
		<p> {{ home_text }} </p>
		<router-link to="/section">
			Go to Section
		</router-link>
	</div>
</template>

<script>
export default {
	name : "Home",
	data() {
		return {
			home_text : "Hello World from Home!"
		};
	}
};
</script>
