/**
 * Section Component
 */

<style lang="stylus">

.section
	padding 20px
	color green

</style>

<template lang="pug">
	div.section
		p {{ section_text }}
		router-link(to="/") Go to Home
</template>

<script>
export default {
	name : "Section",
	data : () => ({
		section_text : "Hello World from Section!"
	})
}
</script>
