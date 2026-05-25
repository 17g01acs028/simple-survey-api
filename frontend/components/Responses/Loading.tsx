import React from 'react'
import { Skeleton } from '../ui/skeleton'

const Loading = () => {
    return (
        <div className="flex items-center w-full justify-center space-x-4">
            <div className=" flex-col items-center w-full justify-center space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[40%]" />
                <Skeleton className="h-4 w-[40%]" />
            </div>
        </div>
    )
}

export default Loading