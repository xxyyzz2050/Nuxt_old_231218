<template>
  <div>

    <b-nav pills>
    <b-nav-item active>Active</b-nav-item>
    <b-nav-item>Link</b-nav-item>
    <b-nav-item-dropdown id="nav7_ddown" text="Dropdown" extra-toggle-classes="nav-link-custom" right>
      <b-dropdown-item>one</b-dropdown-item>
      <b-dropdown-item>two</b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item>three</b-dropdown-item>
    </b-nav-item-dropdown>

    <b-dropdown id="nav7_ddown" text="Dropdown" extra-toggle-classes="nav-link-custom" right>
      <b-dropdown-item>one</b-dropdown-item>
      <b-dropdown-item>two</b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item>three</b-dropdown-item>
    </b-dropdown>


  </b-nav>

  </div>
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>

<style>
a.disabled {
  pointer-events: none;
}

</style>
