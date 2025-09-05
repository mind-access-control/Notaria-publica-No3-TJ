"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Award, GraduationCap } from "lucide-react"

interface TeamMember {
  name: string
  position: string
  image: string
  bio: string
  education: string[]
  experience: string
  specialties: string[]
  email: string
  phone: string
  yearsExperience: number
}

interface TeamMemberModalProps {
  member: TeamMember | null
  isOpen: boolean
  onClose: () => void
}

export function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">{member.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className="w-32 h-32 rounded-lg object-cover border-2 border-primary/20"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Badge variant="secondary" className="text-primary bg-primary/10 mb-2">
                  {member.position}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{member.yearsExperience} años de experiencia</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Biografía Profesional
            </h4>
            <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
          </div>

          {/* Education */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Formación Académica
            </h4>
            <ul className="space-y-2">
              {member.education.map((edu, index) => (
                <li key={index} className="text-muted-foreground text-sm flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  {edu}
                </li>
              ))}
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Experiencia Profesional</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{member.experience}</p>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Especialidades</h4>
            <div className="flex flex-wrap gap-2">
              {member.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
