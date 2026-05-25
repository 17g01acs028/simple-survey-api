import React from 'react'
import { Skeleton } from '../ui/skeleton'

const Loading = () => {
    return (
        <div className="flex items-center space-x-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[300px]" />
            </div>
        </div>
    )
}

export default Loading