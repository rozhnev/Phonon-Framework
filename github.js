/* eslint func-names: 0 */
const info = { user: 'quark-dev', repo: 'Phonon-Framework', branch: 'master' };

function when(commitDate) {
  const commitTime = new Date(commitDate).getTime();
  const todayTime = new Date().getTime();

  const differenceInDays = Math.floor(((todayTime - commitTime)/(24*3600*1000)));

  if (differenceInDays === 0) {
    const differenceInHours = Math.floor(((todayTime - commitTime)/(3600*1000)));
    if (differenceInHours === 0) {
      const differenceInMinutes = Math.floor(((todayTime - commitTime)/(600*1000)));
      if (differenceInMinutes === 0) {
        return 'just now';
      }

      if (differenceInMinutes === 1) {
        return `${differenceInMinutes} minute ago`;
      }

      return `${differenceInMinutes} minutes ago`;
    }

    if (differenceInHours === 1) {
      return `${differenceInHours} hour ago`;
    }

    return `${differenceInHours} hours ago`;
  }

  if (differenceInDays === 1) {
    return 'yesterday';
  }

  return `${differenceInDays} days ago`;
}

function getLastCommit() {
  return new Promise((resolve) => {
    axios({
      url: `https://api.github.com/repos/${info.user}/${info.repo}/commits?sha=${info.branch}`,
      method: 'get'
    }).then((response) => {
      const commits = response.data;
      const cur = commits[0];
      resolve({ sha: cur.sha, date: when(cur.commit.committer.date) });
    });
  });
}

function getLastRelease() {
  return new Promise((resolve) => {
    axios({
      url: `https://api.github.com/repos/${info.user}/${info.repo}/releases/latest`,
      method: 'get'
    }).then((response) => {
      const data = response.data;
      resolve({ tag: data.tag_name, date: when(data.published_at) });
    });
  });
}
