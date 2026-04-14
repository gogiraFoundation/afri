import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getBlogPost } from '../api/client';
import type { BlogPost } from '../types/api';
import './BlogPostPage.css';

interface BlogPostPageProps {
  slug: string;
}

const BlogPostPage = ({ slug }: BlogPostPageProps) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getBlogPost(slug);
        setPost(data);

        if (data.seo_title) {
          document.title = data.seo_title;
        } else {
          document.title = `${data.title} | Afri Cleans`;
        }

        if (data.seo_description) {
          const meta = document.querySelector('meta[name="description"]');
          if (meta) {
            meta.setAttribute('content', data.seo_description);
          }
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to load blog post', err);
        }
        setError('Sorry, this article could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleBackHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="blog-post-shell">
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-page">
        <div className="blog-post-shell">
          <p className="blog-post-error">{error || 'Article not found.'}</p>
          <button className="btn btn-outline blog-post-back" onClick={handleBackHome}>
            Back to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="blog-post-shell">
        <header className="blog-post-header">
          <div>
            <h1 className="blog-post-title">{post.title}</h1>
            {post.published_at && (
              <p className="blog-post-meta">
                {new Date(post.published_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
          <button className="btn btn-outline blog-post-back" onClick={handleBackHome}>
            Back to homepage
          </button>
        </header>

        <article className="blog-post-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;

