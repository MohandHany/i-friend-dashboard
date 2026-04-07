"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, ZoomIn, ZoomOut } from "lucide-react"

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  onCropComplete: (croppedFile: File) => void
}

export function ImageCropDialog({ open, onOpenChange, imageUrl, onCropComplete }: ImageCropDialogProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = React.useState(0.5)
  const [isDragging, setIsDragging] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
  const [image, setImage] = React.useState<HTMLImageElement | null>(null)
  const [isClosing, setIsClosing] = React.useState(false)

  // Load image
  React.useEffect(() => {
    if (!imageUrl) return
    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      setImage(img)
      // Center image's midpoint with crop circle center
      if (canvasRef.current) {
        const canvas = canvasRef.current

        // Start at 50% zoom
        const initialZoom = 0.5
        setZoom(initialZoom)

        // Position so the CENTER of the image aligns with CENTER of canvas
        // Formula: position = (canvas_center - image_center_in_transformed_space)
        // image_center_in_transformed_space = (image_width * zoom) / 2
        const scaledImageWidth = img.width * initialZoom
        const scaledImageHeight = img.height * initialZoom

        setPosition({
          x: (canvas.width - scaledImageWidth) / 2,
          y: (canvas.height - scaledImageHeight) / 2,
        })
      }
    }
  }, [imageUrl])

  // Draw on canvas
  React.useEffect(() => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context
    ctx.save()

    // Apply zoom and position
    ctx.translate(position.x, position.y)
    ctx.scale(zoom, zoom)

    // Draw image
    ctx.drawImage(image, 0, 0)

    // Restore context
    ctx.restore()

    // Draw crop circle overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Cut out circle
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2)
    ctx.fill()

    // Draw circle border
    ctx.globalCompositeOperation = "source-over"
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2)
    ctx.stroke()
  }, [image, zoom, position])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleCrop = () => {
    if (!canvasRef.current || !image) return

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement("canvas")
    const size = 300 // Output size
    cropCanvas.width = size
    cropCanvas.height = size
    const ctx = cropCanvas.getContext("2d")
    if (!ctx) return

    // Calculate the source coordinates
    const canvas = canvasRef.current
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 150

    // Calculate the crop area in the original image coordinates
    // We need to reverse the transformations: scale and translate
    // The center of crop circle in canvas is (centerX, centerY)
    // In image coordinates, this maps to: (centerX - position.x) / zoom, (centerY - position.y) / zoom

    const imageCenterX = (centerX - position.x) / zoom
    const imageCenterY = (centerY - position.y) / zoom
    const imageRadius = radius / zoom

    // Source rectangle in the original image
    const sourceX = imageCenterX - imageRadius
    const sourceY = imageCenterY - imageRadius
    const sourceSize = imageRadius * 2

    // Draw cropped circle
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      size,
      size
    )

    // Convert canvas to blob then to file
    cropCanvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" })
        onCropComplete(file)
        handleClose()
      }
    }, "image/jpeg", 0.95)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }, 200)
  }

  if (!open && !isClosing) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-99999 flex items-center justify-center bg-black/70 backdrop-blur-sm duration-200",
        isClosing ? "animate-out fade-out-0" : "animate-in fade-in-0"
      )}
    >
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-lg p-6 duration-200",
          isClosing ? "animate-out zoom-out-50" : "animate-in zoom-in-50"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-6 w-6 rounded-full z-50"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold mb-4">Crop Image</h2>

        <div className="space-y-4">
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="border border-gray-200 rounded-lg cursor-move touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          />

          <div className="flex items-center gap-4 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.max(0.1, zoom - 0.05))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 w-20 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.min(3, zoom + 0.05))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-4">
            <Button
              className="w-full bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
              onClick={handleCrop}
            >
              Apply
            </Button>
            <Button
              variant="ghost"
              className="w-full px-4 py-5"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
