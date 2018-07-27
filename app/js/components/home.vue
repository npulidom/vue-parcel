/**
 * Home
 */

<style lang="stylus">

.home
	padding 20px
	color blue

</style>

<template lang="pug">

div.home
	p {{ text }}
	router-link(to="/section") Go to Section

</template>

<script>
export default {
	name : "Home",
	data : () => ({ text : "Hello World from Home!" })
}
</script>
