source "https://rubygems.org"

# Jekyll itself
gem "jekyll", "~> 4.3"

# GitHub Pages compatible SEO tag plugin
gem "jekyll-seo-tag", "~> 2.8"

# WEBrick is required for Ruby 3+ (no longer bundled with Ruby)
gem "webrick", "~> 1.8"

# Windows and JRuby extras
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance booster for watching directories on Windows
gem "wdm", "~> 0.1", platforms: [:mingw, :x64_mingw, :mswin]
