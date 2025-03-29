import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'blocked' | 'pending';
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  totalProfit: number;
  activeStrategies: number;
  referralCount: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
  });

  // 模拟数据
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        status: 'active',
        role: 'user',
        createdAt: '2024-01-01',
        lastLogin: '2024-03-20',
        totalProfit: 1000,
        activeStrategies: 2,
        referralCount: 3,
      },
      // 添加更多模拟数据...
    ];
    setUsers(mockUsers);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    // 实现删除用户逻辑
    console.log('删除用户:', userId);
  };

  const handleBlockUser = (userId: string) => {
    // 实现封禁用户逻辑
    console.log('封禁用户:', userId);
  };

  const handleUnblockUser = (userId: string) => {
    // 实现解封用户逻辑
    console.log('解封用户:', userId);
  };

  const handleSaveUser = () => {
    // 实现保存用户逻辑
    console.log('保存用户:', formData);
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'blocked':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        用户管理
      </Typography>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总用户数
              </Typography>
              <Typography variant="h4">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                活跃用户
              </Typography>
              <Typography variant="h4">
                {users.filter(user => user.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                封禁用户
              </Typography>
              <Typography variant="h4">
                {users.filter(user => user.status === 'blocked').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                待审核用户
              </Typography>
              <Typography variant="h4">
                {users.filter(user => user.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 用户列表 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>注册时间</TableCell>
              <TableCell>最后登录</TableCell>
              <TableCell>总收益</TableCell>
              <TableCell>活跃策略</TableCell>
              <TableCell>推荐人数</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>${user.totalProfit}</TableCell>
                  <TableCell>{user.activeStrategies}</TableCell>
                  <TableCell>{user.referralCount}</TableCell>
                  <TableCell>
                    <Tooltip title="编辑">
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {user.status === 'active' ? (
                      <Tooltip title="封禁">
                        <IconButton
                          size="small"
                          onClick={() => handleBlockUser(user.id)}
                        >
                          <BlockIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="解封">
                        <IconButton
                          size="small"
                          onClick={() => handleUnblockUser(user.id)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="删除">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* 编辑用户对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editMode ? '编辑用户' : '新建用户'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="用户名"
            fullWidth
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="邮箱"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="角色"
            fullWidth
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 