/**
 * Section
 */

<script>
export default {

	name: "Section"
}
</script>

<template lang="pug">

.section

	router-link(to="/") Go to Home

</template>

<style lang="stylus" scoped>

.section
	padding 20px
	color green

	img
		display block
		max-width 100px
		margin-bottom 10px

</style>
