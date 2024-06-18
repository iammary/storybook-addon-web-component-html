/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [
          { type: "docs", scope: "README", release: "patch" },
          { type: "refactor", release: "minor" },
          { type: "chore", release: "patch" },
          { type: "style", release: "patch" },
          { scope: "no-release", release: false },
        ],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalCommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "perf", section: "Performance Improvements" },
            { type: "revert", section: "Reverts" },
            { type: "docs", section: "Documentation", hidden: false },
            { type: "style", section: "Styles", hidden: false },
            { type: "chore", section: "Miscellaneous Chores", hidden: false },
            { type: "refactor", section: "Code Refactors", hidden: false },
            { type: "test", section: "Tests", hidden: false },
            { type: "build", section: "Build System", hidden: false },
            { type: "ci", section: "CI/CD", hidden: false },
            { type: "improvement", section: "Improvements", hidden: false },
          ],
        },
      },
    ],
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        publishCmd: 'echo "nextVer=${nextRelease.version}" >> $GITHUB_OUTPUT',
      },
    ],
  ],
};
