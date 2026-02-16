import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách khóa học đã publish (public)' })
  @ApiResponse({ status: 200 })
  listCourses() {
    return this.coursesService.listPublished();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khóa học (kèm danh sách lesson)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Course not found' })
  getCourse(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Teacher tạo khóa học mới (mặc định DRAFT)' })
  @ApiResponse({ status: 201 })
  createCourse(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateCourseDto,
  ) {
    return this.coursesService.createForTeacher(user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Teacher cập nhật khóa học của mình' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Course not found or not owned' })
  updateCourse(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, user.userId, dto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Teacher publish khóa học của mình' })
  publishCourse(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.coursesService.publishCourse(id, user.userId);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Teacher unpublish khóa học của mình' })
  unpublishCourse(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.coursesService.unpublishCourse(id, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Teacher xóa mềm khóa học của mình' })
  @ApiResponse({ status: 204 })
  async deleteCourse(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    await this.coursesService.softDelete(id, user.userId);
  }
}
