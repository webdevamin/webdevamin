import React from 'react'
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

const SocialShares = ({ url, title, description, imageUrl }) => {
    return (
        <div className={`social_shares`}>
            <FacebookShareButton
                url={url}
                quote={title}
            >
                <FacebookIcon round />
            </FacebookShareButton>
            <RedditShareButton
                url={url}
                title={title}
            >
                <RedditIcon round />
            </RedditShareButton>
            <WhatsappShareButton
                url={url}
                title={title}
                separator=": "
            >
                <WhatsappIcon round />
            </WhatsappShareButton>
            <LinkedinShareButton url={url}>
                <LinkedinIcon round />
            </LinkedinShareButton>
            <TwitterShareButton
                url={url}
                title={title}
            >
                <TwitterIcon round />
            </TwitterShareButton>
            <PinterestShareButton
                url={url}
                description={title}
                media={imageUrl}
            >
                <PinterestIcon round />
            </PinterestShareButton>
            <EmailShareButton
                url={url}
                subject={title}
                body={description}
            >
                <EmailIcon round />
            </EmailShareButton>
        </div>
    )
}

export default SocialShares