-- Query used to assigned a work item to a user.
-- Using a special query to prioritize the allocation as per relevant business needs


-- Priority 
-- Oldest expired follow-ups (past 12 hours)
-- Work items with aux_owner matching owner ID (reopens)
-- Work items where due_date will reach in less than 2 hours
-- then everything, lese sorted by ASC due_date 

 UPDATE work_items
                SET assignee_id = $1, status = 'Work in Progress', last_assigned_at = CURRENT_TIMESTAMP
                WHERE id = (
                    WITH priority_ordered_work_items AS (
                        SELECT
                            CASE
                                -- Check if requester's user and some aux_owner match
                                WHEN EXISTS (
                                    SELECT 1
                                    FROM users u
                                    WHERE split_part(u.email, '@', 1) = wi.aux_owner
                                      AND u.id = $1 
                                )
                                THEN wi.priority - 2

                                -- Expired Follow ups past 12h
                                WHEN AGE(NOW(), wi.follow_up_date) > INTERVAL '12 hours'
                                THEN wi.priority - 2

                                -- past due date -> lower priority
                                WHEN AGE(wi.due_date, NOW()) < INTERVAL '0'
                                THEN wi.priority + 1

                                -- approaching due date in less then 2h
                                WHEN AGE(wi.due_date, NOW()) < INTERVAL '2 hours'
                                THEN wi.priority - 1

                                ELSE wi.priority
                            END AS priority_calc,

                            id
                        
                        FROM
                            work_items wi
                        WHERE
                            team_id = $2 

                            -- Only in scope item status 
                            AND status IN ('Unassigned', 'Reopened', 'Pending') 

                            -- exclude what user already has assigned
                            AND id NOT IN (
                                SELECT id FROM work_items WHERE assignee_id = $1
                            )

                            -- to check this later as it might be redundant
                            AND (
                                (AGE(NOW(), wi.follow_up_date) > INTERVAL '12 hours' AND wi.status = 'Pending')
                                OR wi.status IN ('Unassigned', 'Reopened')
                            )
                        ORDER BY priority_calc, wi.follow_up_date,  due_date
                    )
                    
                    SELECT
                        id
                    FROM
                        priority_ordered_work_items
                    LIMIT 1
                )
                RETURNING *;

                -- [requesterId, teamId]
------------------------------------

----- SAVE 

WITH priority_ordered_work_items AS (
    SELECT
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM users u
                WHERE split_part(u.email, '@', 1) = wi.aux_owner
                  AND u.id = 1 -- to be modified with the id of the user requestiong a work item 
            )
            THEN wi.priority - 2
            WHEN AGE(NOW(), wi.follow_up_date) > INTERVAL '12 hours'
            THEN wi.priority - 2
            WHEN AGE(wi.due_date, NOW()) < INTERVAL '0'
            THEN wi.priority + 1
            WHEN AGE(wi.due_date, NOW()) < INTERVAL '2 hours'
            THEN wi.priority - 1
            ELSE wi.priority
        END AS priority_calc,
	
		CASE
            WHEN due_date > NOW() 
			THEN AGE(due_date, NOW())
            ELSE AGE(NOW(), due_date)
        END AS due_date_diff,
	
		
		CASE
            WHEN follow_up_date > NOW() 
			THEN AGE(follow_up_date, NOW())
            ELSE AGE(NOW(), follow_up_date)
        END AS follow_up_date_diff,
	
        *
	
    FROM
        work_items wi
    WHERE
        team_id = 2
        AND status IN ('Unassigned', 'Reopened', 'Pending')
        AND (
            (AGE(NOW(), wi.follow_up_date) > INTERVAL '12 hours' AND wi.status = 'Pending')
            OR wi.status IN ('Unassigned', 'Reopened')
        )
    ORDER BY priority_calc, wi.follow_up_date,  due_date
)

SELECT
	CASE
		WHEN due_date > NOW() 
		THEN 'Time left: ' || due_date_diff
		ELSE 'Past due: ' || due_date_diff
	END AS due_date_status,
	
	CASE
		WHEN due_date > NOW() 
		THEN 'Time left: ' || follow_up_date_diff
		ELSE 'Past due: ' || follow_up_date_diff
	END AS follow_up_date_status,
    *
FROM
    priority_ordered_work_items;