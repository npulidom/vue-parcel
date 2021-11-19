/**
 * Home
 */

<script>

export default {

	name: "Home",

	data: () => ({ text: "Hello World from Home!" })
}
</script>

<template lang="pug">

.home

	p {{ text }}

	router-link(to="/section") Go to Section

</template>

<style lang="stylus" scoped>

.home
	padding 20px
	color orange

</style>
