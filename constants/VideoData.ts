export interface VideoLecture {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  videoId?: string;
}

export const CHANNEL_PLAYLISTS_URL = 'https://www.youtube.com/@seniordevtuts/playlists';

export const VIDEOS: VideoLecture[] = [
  {
    id: 'java',
    title: 'Java Programming',
    subtitle: 'Java Playlist',
    url: 'https://www.youtube.com/playlist?list=PL1xhBcK58xmb0ZW8GY94ULdpUroCMetXo',
    videoId: '4ONWGQauCNc',
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    subtitle: 'Senior Dev Tuts',
    url: CHANNEL_PLAYLISTS_URL,
  },
  {
    id: 'dbms',
    title: 'Database Management Systems',
    subtitle: 'Senior Dev Tuts',
    url: CHANNEL_PLAYLISTS_URL,
  },
  {
    id: 'os',
    title: 'Operating Systems',
    subtitle: 'Senior Dev Tuts',
    url: CHANNEL_PLAYLISTS_URL,
  },
  {
    id: 'cn',
    title: 'Computer Networks',
    subtitle: 'Senior Dev Tuts',
    url: CHANNEL_PLAYLISTS_URL,
  },
];