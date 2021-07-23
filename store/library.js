export const state = () => ({
  list: [],
  cards: {},
});

export const getters = {
  cardIds: (state) => state.list,
  cardSets: (state) => state.list.map((id) => state.cards[id]),

  card: (state) => (id) => { return state.card[id]; },
}

export const mutations = {

  createDenizen(state, { name, suit }) {

    const id = 1;

    const newDenizen = {};
    Object.assign(newDenizen, createDenizen(id, name, suit));

    state.list.push(id);
    const newObj = {};
    newObj[id] = newDenizen;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

  }

}

export const actions = {}

const createDenizen = (
  id = -1,
  name = 'some fancy name',
  suit = 'arcane',
  type = 'power',
  text = 'some fancy text for {1}'
) => ({
  __type: 'denizen',
  name,
  suit,
  restriction: null,
  type,
  modifer: null,
  cost: null,
  text,
  image: '',
});
