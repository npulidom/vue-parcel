/**
 * Home Component
 */

<style lang="stylus">

.home
	padding 20px
	color blue

</style>

<template lang="pug">
	div.home
		p {{ home_text }}
		router-link(to="/section") Go to Section
</template>

<script>
export default {
	name : "Home",
	data : () => ({
		home_text : "Hello World from Home!"
	})
}
</script>
