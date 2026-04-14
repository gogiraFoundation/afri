import { useEffect, useState } from 'react';
import { getBlogPosts } from '../api/client';
import type { BlogPost } from '../types/api';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to load blog posts', err);
        }
        setError('Unable to load latest articles right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading && posts.length === 0) {
    return (
      <section id="blog" className="section blog-section">
        <div className="container">
          <div className="blog-header">
            <span className="section-title">Insights</span>
            <h2>From the Afri Cleans Blog</h2>
            <p className="blog-description">Practical tips and ideas for a cleaner, healthier space.</p>
          </div>
          <div className="blog-loading">Loading articles...</div>
        </div>
      </section>
    );
  }

  if (error && posts.length === 0) {
    return (
      <section id="blog" className="section blog-section">
        <div className="container">
          <div className="blog-header">
            <span className="section-title">Insights</span>
            <h2>From the Afri Cleans Blog</h2>
          </div>
          <p className="blog-error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="section blog-section">
      <div className="container">
        <div className="blog-header">
          <span className="section-title">Insights</span>
          <h2>From the Afri Cleans Blog</h2>
          <p className="blog-description">
            Explore cleaning tips, healthy home ideas, and practical guides from our team.
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <h3 className="blog-card-title">{post.title}</h3>
              {post.published_at && (
                <p className="blog-card-meta">
                  {new Date(post.published_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
              {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
              <a href={`/blog/${post.slug}`} className="blog-card-link">
                Read article →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;

