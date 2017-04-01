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
		<p>
			{{ section_text }} <i class="fa fa-thumbs-o-up"></i>
		</p>
		<router-link to="/"> Go to Home </router-link>
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
