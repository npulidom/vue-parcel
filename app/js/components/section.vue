/**
 * Section Component
 */

<style lang="scss">
	div.section {
		color: purple;
	}
</style>

<template>
	<div class="section">
		<p> <i class="fa fa-thumbs-o-up"></i> {{ section_text }} </p>
		<router-link to="/">
			Go to Home
		</router-link>
	</div>
</template>

<script>
export default {
	name : "Section",
	data() {
		return {
			section_text : "Hello World from Section!"
		};
	}
};
</script>
