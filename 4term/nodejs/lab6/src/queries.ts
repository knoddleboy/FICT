/** task 1 */
export const getUserChannelsSortedByCreationDate = () => {
    return `
        select
            u.id as user_id,
            u.name as user_name,
            u.avatar_url,
            c.photo_url as channel_photo,
            c.description as channel_description,
            c.created_at as channel_creation_date
        from
            users u
            inner join channels c on u.id = c.user_id
        order by
            c.created_at desc;
    `;
};

/** task 2 */
export const getTopLikedVideos = () => {
    return `
        select
            v.id as video_id,
            v.title, v.description, v.preview_url, v.file_url, v.duration, v.published_at,
            count(l.user_id) as likes_count
        from
            videos v
            inner join likes l on v.id = l.video_id
        group by
            v.id
        order by
            likes_count desc
        limit 5;
    `;
};

/** task 3 */
export const getVideosByStephanieBulger = () => {
    return `
        select
            v.id as video_id,
            v.title,
            v.preview_url as video_preview,
            v.duration as video_duration,
            v.published_at as video_publish_date
        from
            videos v
            inner join channels c on v.channel_id = c.id
            inner join users u on u.id = c.user_id
        where
            u.name = 'Stephanie Bulger'
        order by
            v.published_at desc;
    `;
};

/** task 4 */
export const getChannelSubscribersById = () => {
    return `
        select
            c.id as channel_id,
            c.user_id, c.description, c.photo_url,
            c.created_at as channel_creation_date,
            count(s.user_id) as subscribers_count
        from
            channels c
            left join subscriptions s on c.id = s.channel_id
        where
            c.id = '79f6ce8f-ee0c-4ef5-9c36-da06b7f4cb76'
        group by
            c.id;
    `;
};

/** task 5 */
export const getTopRatedVideosAfterDate = () => {
    return `
        select
            v.id as video_id,
            v.title, v.preview_url, v.duration, v.published_at,
            count(*) as rating_count,
            sum(case when l.positive then 1 else -1 end) as total_rating
        from
            videos v
            inner join likes l on v.id = l.video_id
        where
            v.published_at >= '2021-09-01'
        group by
            v.id
        having
            count(case when l.positive then 1 end) > 4
        order
            by rating_count desc
        limit 10;
    `;
};

/** task 6 */
export const getEnnisHaestierSubscribedChannelsSortedByLevel = () => {
    return `
        select
            u.name as channel_name,
            u.avatar_url as channel_avatar,
            c.photo_url as channel_photo,
            c.description as channel_description,
            s.level as subscription_level,
            s.subscribed_at as subscription_date
        from
            subscriptions s
            join users u on s.user_id = u.id
            join channels c on s.channel_id = c.id
        where
            u.name = 'Ennis Haestier'
        order by
            case s.level
                when 'vip' then 1
                when 'follower' then 2
                when 'fan' then 3
                else 4
            end,
            s.subscribed_at desc;
    `;
};
