/**
 * Section
 */

<style lang="stylus" scoped>

.section
	padding 20px
	color green

	img
		display block
		max-width 100px
		margin-bottom 10px

</style>

<template lang="pug">

.section

	img(src="../images/icons/example.png" alt="")

	router-link(to="/") Go to Home

</template>

<script>
export default {

	name: "Section"
}
</script>
