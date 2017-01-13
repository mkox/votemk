import Vue from 'vue';
import Votegrid from 'src/components/Votegrid';

// helper function that mounts and returns the rendered text without "\n" and " "
function getRenderedText(Component, propsData) {
  const Ctor = Vue.extend(Component);
  const vm = new Ctor({ propsData }).$mount();
  var text = vm.$el.textContent;
  text = text.replace(/\n/g, "");
  text = text.replace(/ /g, "");
  return text;
}

describe('Votegrid', () => {
    
  it('render 1 column name of prop', () => {
    expect(getRenderedText(Votegrid, {
      columns: ['col1']
    }) ).to.equal('Col1');
  });
  it('render 2 column names of prop', () => {
    expect(getRenderedText(Votegrid, {
      columns: ['col1', 'col2']
    }) ).to.equal('Col1Col2');
  });
})