/* Resolvers */
const courses = [
  {
    title: 'Casino Royale',
    technology: 'Bytecard'
  },
  {
    title: 'Story of the Late Chrysanthemums, The (Zangiku monogatari)',
    technology: 'Bitchip'
  },
  {
    title: 'Hum Tum',
    technology: 'Latlux'
  },
  {
    title: 'Genius Within: The Inner Life of Glenn Gould',
    technology: 'Overhold'
  },
  {
    title: 'Support Your Local Gunfighter',
    technology: 'Fix San'
  },
  {
    title: 'Sex & Drugs & Rock & Roll',
    technology: 'Holdlamis'
  },
  {
    title: 'Spice World',
    technology: 'Veribet'
  },
  {
    title: 'Maleficent',
    technology: 'Tin'
  },
  {
    title: 'Pauline & Paulette (Pauline en Paulette)',
    technology: 'Asoka'
  },
  {
    title: 'Death of a Dynasty',
    technology: 'Solarbreeze'
  }
]

const resolvers = {
  Query: {
    getCourses: function () {
      return courses
    },
    getTechnologies: function () {
      return courses
    }
  }
}

export default resolvers
