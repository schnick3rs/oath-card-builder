import { nanoid } from 'nanoid';

export const state = () => ({
  list: [],
  cards: {},
});

export const getters = {
  cardIds: (state) => state.list,
  cardSets: (state) => state.list.map((id) => state.cards[id]),

  card: (state) => (id) => { return state.cards[id]; },
}

export const mutations = {

  createDenizen(state, { name, suit }) {

    const id = nanoid(4);
    console.info(id)

    const newDenizen = {};
    Object.assign(newDenizen, createDenizen(id, name, suit));

    state.list.push(id);
    const newObj = {};
    newObj[id] = newDenizen;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

  },

  saveDenizen(state, { id, denizen }) {
    const newObj = {};
    newObj[id] = denizen;
    state.cards = {
      ...state.cards,
      ...newObj,
    }
  },

}

export const actions = {}

const createDenizen = (
  id = nanoid(7),
  name = 'some fancy name',
  suit = 'arcane',
  restriction = undefined,
  type = 'power',
  cost = null,
  modifer = null,
  text = 'some fancy text for {1}',
  image = ''
) => ({
  id,
  __type: 'denizen',
  name,
  suit,
  restriction,
  type,
  modifer,
  cost,
  text,
  image,
});
