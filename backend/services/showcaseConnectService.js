/**
 * Parse user input (username or full profile URL) into connect payload per platform.
 */
export function parsePlatformInput(platform, rawInput, extra = {}) {
  const input = (rawInput || '').trim();
  if (!input) return null;

  switch (platform) {
    case 'github': {
      const m = input.match(/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?)/i);
      return { username: m ? m[1] : input.replace(/^@/, '') };
    }
    case 'leetcode': {
      const m = input.match(/leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/i);
      return { username: m ? m[1] : input.replace(/^@/, '') };
    }
    case 'codeforces': {
      const m = input.match(/codeforces\.com\/profile\/([a-zA-Z0-9_.-]+)/i);
      return { username: m ? m[1] : input.replace(/^@/, '') };
    }
    case 'hackerrank': {
      const m = input.match(/hackerrank\.com\/([a-zA-Z0-9_-]+)/i);
      return { username: m ? m[1] : input.replace(/^@/, '') };
    }
    case 'stackoverflow': {
      const idMatch = input.match(/stackoverflow\.com\/users\/(\d+)/i);
      if (idMatch) return { userId: idMatch[1] };
      if (/^\d+$/.test(input)) return { userId: input };
      return null;
    }
    case 'devto': {
      const m = input.match(/dev\.to\/([a-zA-Z0-9_-]+)/i);
      return { username: m ? m[1] : input.replace(/^@/, '') };
    }
    case 'codepen': {
      const m = input.match(/codepen\.io\/([a-zA-Z0-9_-]+)/i);
      return { username: m ? m[1] : input.replace(/^@/, '') };
    }
    case 'linkedin': {
      const url = input.startsWith('http') ? input : `https://linkedin.com/in/${input.replace(/^@/, '')}`;
      return { profileUrl: url, headline: extra.headline || '' };
    }
    case 'portfolio': {
      const url = input.startsWith('http') ? input : `https://${input}`;
      return {
        websiteUrl: url,
        title: extra.title || '',
        description: extra.description || '',
      };
    }
    default:
      return null;
  }
}

export async function fetchGithubProfile(username) {
  const profileRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: { 'User-Agent': 'SkillVerse-Showcase/1.0' },
  });
  if (!profileRes.ok) throw new Error('GitHub user not found');
  const profile = await profileRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers: { 'User-Agent': 'SkillVerse-Showcase/1.0' },
  });
  const repos = reposRes.ok ? await reposRes.json() : [];
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const topLanguages = [...new Set(repos.map((r) => r.language).filter(Boolean))].slice(0, 6);

  return {
    connected: true,
    username: profile.login,
    profileUrl: profile.html_url,
    avatarUrl: profile.avatar_url || '',
    bio: profile.bio || '',
    publicRepos: profile.public_repos || 0,
    totalStars,
    followers: profile.followers || 0,
    following: profile.following || 0,
    topLanguages,
    lastSynced: new Date(),
  };
}

export async function fetchLeetCodeProfile(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking }
        submitStats {
          acSubmissionNum { difficulty count }
        }
      }
    }
  `;
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username } }),
  });
  const json = await res.json();
  const user = json?.data?.matchedUser;
  if (!user) throw new Error('LeetCode user not found');

  const stats = user.submitStats?.acSubmissionNum || [];
  const get = (d) => stats.find((s) => s.difficulty === d)?.count || 0;
  const totalSolved = get('All');
  const easySolved = get('Easy');
  const mediumSolved = get('Medium');
  const hardSolved = get('Hard');

  return {
    connected: true,
    username: user.username,
    profileUrl: `https://leetcode.com/u/${user.username}`,
    ranking: user.profile?.ranking || 0,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    acceptanceRate: totalSolved > 0 ? Math.min(100, (totalSolved / 30)) : 0,
    lastSynced: new Date(),
  };
}

export async function fetchCodeforcesProfile(username) {
  const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`);
  const json = await res.json();
  if (json.status !== 'OK' || !json.result?.[0]) throw new Error('CodeForces user not found');
  const u = json.result[0];
  return {
    connected: true,
    username: u.handle,
    profileUrl: `https://codeforces.com/profile/${u.handle}`,
    rating: u.rating || 0,
    maxRating: u.maxRating || 0,
    rank: u.rank || 'Unrated',
    maxRank: u.maxRank || '',
    contestsCount: 0,
    lastSynced: new Date(),
  };
}

export async function fetchHackerrankProfile(username) {
  const res = await fetch(`https://www.hackerrank.com/rest/hackers/${encodeURIComponent(username)}/badges`, {
    headers: { 'User-Agent': 'SkillVerse-Showcase/1.0' },
  });
  let badges = 0;
  let points = 0;
  if (res.ok) {
    const json = await res.json();
    const models = json?.models || [];
    badges = models.length;
    points = models.reduce((sum, b) => sum + (b.total_points || 0), 0);
  }
  return {
    connected: true,
    username,
    profileUrl: `https://www.hackerrank.com/${username}`,
    badges,
    points,
    solvedProblems: badges,
    languages: [],
    lastSynced: new Date(),
  };
}

export async function fetchStackoverflowProfile(userId) {
  const res = await fetch(
    `https://api.stackexchange.com/2.3/users/${userId}?site=stackoverflow&filter=default`
  );
  const json = await res.json();
  const user = json?.items?.[0];
  if (!user) throw new Error('Stack Overflow user not found');
  const badgeCount = (user.badge_counts?.gold || 0) + (user.badge_counts?.silver || 0) + (user.badge_counts?.bronze || 0);
  return {
    connected: true,
    userId: String(user.user_id),
    profileUrl: user.link,
    reputation: user.reputation || 0,
    badges: badgeCount,
    answers: 0,
    displayName: user.display_name || '',
    lastSynced: new Date(),
  };
}

export async function fetchDevtoProfile(username) {
  const res = await fetch(`https://dev.to/api/users/by_username?url=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error('Dev.to user not found');
  const user = await res.json();
  return {
    connected: true,
    username: user.username,
    profileUrl: `https://dev.to/${user.username}`,
    articlesCount: 0,
    followers: 0,
    following: 0,
    bio: user.summary || user.bio || '',
    lastSynced: new Date(),
  };
}

export async function fetchCodepenProfile(username) {
  return {
    connected: true,
    username,
    profileUrl: `https://codepen.io/${username}`,
    pens: 0,
    followers: 0,
    lastSynced: new Date(),
  };
}

export const ALL_PLATFORMS = [
  'github', 'linkedin', 'leetcode', 'codeforces', 'hackerrank',
  'stackoverflow', 'devto', 'portfolio', 'codepen',
];

export const PLATFORM_FETCHERS = {
  github: (d) => fetchGithubProfile(d.username),
  leetcode: (d) => fetchLeetCodeProfile(d.username),
  codeforces: (d) => fetchCodeforcesProfile(d.username),
  hackerrank: (d) => fetchHackerrankProfile(d.username),
  stackoverflow: (d) => fetchStackoverflowProfile(d.userId),
  devto: (d) => fetchDevtoProfile(d.username),
  codepen: (d) => fetchCodepenProfile(d.username),
};
