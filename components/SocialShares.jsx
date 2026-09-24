'use client';

import { useState } from 'react';
import {
    FacebookShareButton,
    FacebookIcon,
    RedditShareButton,
    RedditIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
    EmailShareButton,
    EmailIcon,
    TwitterShareButton,
    TwitterIcon,
    PinterestShareButton,
    PinterestIcon,
} from 'next-share';

const SocialShares = ({ url, title, description, shareText, imageUrl, locale }) => {
    const [copyStatus, setCopyStatus] = useState(null);
    const isDutch = locale === 'nl';
    const postText = shareText || description;
    const shareLabel = isDutch ? 'Delen via' : 'Share on';

    const copyPostText = async () => {
        try {
            await navigator.clipboard.writeText(postText);
            setCopyStatus('copied');
        } catch {
            setCopyStatus('failed');
        }
    };

    return (
        <>
            <div className="social_shares">
                <FacebookShareButton url={url} aria-label={`${shareLabel} Facebook`}>
                    <FacebookIcon round />
                </FacebookShareButton>
                <RedditShareButton url={url} title={title} aria-label={`${shareLabel} Reddit`}>
                    <RedditIcon round />
                </RedditShareButton>
                <WhatsappShareButton url={url} title={postText} separator=" " aria-label={`${shareLabel} WhatsApp`}>
                    <WhatsappIcon round />
                </WhatsappShareButton>
                <LinkedinShareButton url={url} aria-label={`${shareLabel} LinkedIn`}>
                    <LinkedinIcon round />
                </LinkedinShareButton>
                <TwitterShareButton url={url} title={postText} aria-label={`${shareLabel} X`}>
                    <TwitterIcon round />
                </TwitterShareButton>
                <PinterestShareButton url={url} description={description} media={imageUrl} aria-label={`${shareLabel} Pinterest`}>
                    <PinterestIcon round />
                </PinterestShareButton>
                <EmailShareButton url={url} subject={title} body={postText} separator="\n\n" aria-label={`${shareLabel} email`}>
                    <EmailIcon round />
                </EmailShareButton>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="max-w-xl text-sm text-dark/70">{postText}</p>
                <button
                    type="button"
                    onClick={copyPostText}
                    className="text-sm underline underline-offset-2 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    {isDutch ? 'Kopieer tekst voor Facebook of LinkedIn' : 'Copy text for Facebook or LinkedIn'}
                </button>
                <span role="status" className="text-xs text-dark/70">
                    {copyStatus === 'copied' && (isDutch ? 'Gekopieerd. Plak de tekst in je bericht.' : 'Copied. Paste it into your post.')}
                    {copyStatus === 'failed' && (isDutch ? 'Kopiëren lukte niet. Selecteer de tekst hierboven.' : 'Could not copy. Select the text above.')}
                </span>
            </div>
        </>
    )
}

export default SocialShares
