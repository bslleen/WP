export const works = [
  {
    id: 1,
    title: 'The Amber Meridian',
    category: 'Novel',
    year: '2023',
    description: 'A gothic novel tracing three generations of a crumbling coastal family, haunted by a lighthouse that blinks in patterns no sailor can read.',
    excerpt: 'The light came not from any star, but from something older — something that had learned, long ago, to imitate the sky.',
    coverColor: '#2a1f0e',
    accentColor: '#c9a84c',
    pages: 312,
    status: 'Published',
  },
  {
    id: 2,
    title: 'Salt & Silence',
    category: 'Poetry',
    year: '2022',
    description: 'A collection of forty-three poems written during a winter residency on the Orkney Islands. Wind, stone, and the grammar of loneliness.',
    excerpt: 'You left the door open — \nnot as invitation \nbut as the last kind of forgetting.',
    coverColor: '#1a1209',
    accentColor: '#a89060',
    pages: 88,
    status: 'Published',
  },
  {
    id: 3,
    title: 'The Cartographer\'s Wife',
    category: 'Short Story',
    year: '2024',
    description: 'A woman inherits her late husband\'s collection of maps and discovers each one charts not territory, but emotional states.',
    excerpt: 'Here be grief, he had written, in his careful hand, and drawn it as an inland sea.',
    coverColor: '#0d1a14',
    accentColor: '#6b8f6b',
    pages: 28,
    status: 'Published',
  },
  {
    id: 4,
    title: 'Rooms That Remember',
    category: 'Novel',
    year: '2024',
    description: 'An archivist cataloguing an estate discovers the house has its own memory — one far more accurate than any living person\'s.',
    excerpt: 'The wallpaper had absorbed thirty years of arguments. She pressed her palm to it and the plaster was warm.',
    coverColor: '#1a0d12',
    accentColor: '#8a3a5a',
    pages: 0,
    status: 'In Progress',
  },
  {
    id: 5,
    title: 'Field Notes: Migrations',
    category: 'Poetry',
    year: '2023',
    description: 'Poems written in transit — airports, train stations, border crossings. The music of threshold spaces.',
    excerpt: 'Every arrival is a small death. \nYou leave behind the self \nwho did not know this place.',
    coverColor: '#0d1420',
    accentColor: '#4a7a9b',
    pages: 64,
    status: 'Published',
  },
  {
    id: 6,
    title: 'The Taxidermist\'s Daughter',
    category: 'Short Story',
    year: '2021',
    description: 'A coming-of-age story in which a girl learns that preservation is not the same as keeping, and loss is not the same as absence.',
    excerpt: 'Everything in our house had been stopped mid-motion. I grew up believing that was what love looked like.',
    coverColor: '#1a1506',
    accentColor: '#c9832c',
    pages: 34,
    status: 'Published',
  },
]

export const journalEntries = [
  {
    id: 1,
    title: 'On Writing in Winter',
    date: 'March 3, 2024',
    category: 'Craft',
    excerpt: 'There is something about the shortness of winter days that contracts language. I find myself writing in shorter sentences, as if the cold has gotten into the syntax.',
    body: `There is something about the shortness of winter days that contracts language. I find myself writing in shorter sentences, as if the cold has gotten into the syntax.

I have been at the desk since before light. The window shows me nothing but my own reflection superimposed on darkness, and I take it as instruction: look inward, the window says. Look inward and write from there.

The novel is at a difficult passage — not difficult in the sense of being blocked, but difficult in the way that a surgeon's cut is difficult. Precise, necessary, unkind.`,
    readTime: '4 min',
  },
  {
    id: 2,
    title: 'The Archive Visit',
    date: 'January 17, 2024',
    category: 'Research',
    excerpt: 'The letters were three hundred years old and still smelled of the house they had been written in — or so I imagined. More likely they smelled of preservation fluid and time.',
    body: `The letters were three hundred years old and still smelled of the house they had been written in — or so I imagined. More likely they smelled of preservation fluid and time.

I spent six hours in the archive reading room, transcribing the correspondence of a woman whose name appears in no history books. She wrote every Tuesday. She wrote about weather, about neighbors, about the small adjustments a life requires. She wrote, once, about a grief so large she had no language for it, only the white space where the sentence ended.

I found my next novel in that white space.`,
    readTime: '3 min',
  },
  {
    id: 3,
    title: 'Notes on Revision',
    date: 'November 29, 2023',
    category: 'Craft',
    excerpt: 'Revision is not fixing what is broken. It is discovering what the work actually is, as opposed to what you thought you were writing.',
    body: `Revision is not fixing what is broken. It is discovering what the work actually is, as opposed to what you thought you were writing.

I am in the fourth revision of the manuscript. By now it bears only family resemblance to the first draft — the same bones, different everything else. The first draft was written by someone who did not yet know the story. I am the someone who knows.

The question every revision asks: does this sentence earn its place? Not: is it well-written, which is a different and lesser question. But: does it contribute to the whole? Does it carry weight? Does the story need it, or do I?`,
    readTime: '5 min',
  },
  {
    id: 4,
    title: 'A Walk in Dusk',
    date: 'October 8, 2023',
    category: 'Notebook',
    excerpt: 'Walked the canal at dusk. Two herons stood motionless in the shallows like forgotten punctuation.',
    body: `Walked the canal at dusk. Two herons stood motionless in the shallows like forgotten punctuation.

There is a hour, approximately forty minutes after sunset, when the world becomes available to writers. The light does something complicated. Everything is still visible, but nothing casts a shadow. The absence of shadow makes objects look closer to their true selves — no distortion, no drama, only the thing.

I walked and did not take notes. The notebook stayed in my pocket. There is a kind of taking notes that happens without the notebook, a porous kind of attention where you open yourself and let the world make impressions. Tomorrow I will write. Tonight I was only a surface.`,
    readTime: '3 min',
  },
]

export const featuredWorks = works.filter(w => w.status === 'Published').slice(0, 3)
