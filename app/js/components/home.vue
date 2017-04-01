/**
 * Home Component
 */

<style lang="scss">
	div.home {
		color: blue;
	}
</style>

<template>
	<div class="home">
		<p> <i class="fa fa-thumbs-o-up"></i> {{ home_text }} </p>
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
